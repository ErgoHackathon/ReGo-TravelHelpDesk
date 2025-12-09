using DataTravelManagement.Model;

using Tesseract;

namespace DataTravelManagement.Ocr
{
    public class OcrServices
    {
        public PassportInfoMaster OCR(byte[] imageBytes)
        {
            string tessdataPath = @"C:\tessdata";

            if (!Directory.Exists(tessdataPath))
            {
                Console.Error.WriteLine($"tessdata folder not found: {tessdataPath}");
                return null;
            }

            try
            {
                using var pix = Pix.LoadFromMemory(imageBytes);

                string[] languageCandidates = new[] { "mrz", "eng" };

                string? line1 = null;
                string? line2 = null;

                foreach (var lang in languageCandidates)
                {
                    using var engine = CreateEngine(tessdataPath, lang);

                    var mrzRect = GetBottomRect(pix, 0.35f);

                    var lines = OcrLinesFromRect(engine, pix, mrzRect);
                    var mrzLike = FilterMrzLike(lines);

                    if (mrzLike.Count < 2)
                    {
                        var (band1, band2) = SliceMrzBands(mrzRect);
                        var l1 = OcrSingleLine(engine, pix, band1);
                        var l2 = OcrSingleLine(engine, pix, band2);
                        if (!string.IsNullOrWhiteSpace(l1)) mrzLike.Add(NormalizeRaw(l1));
                        if (!string.IsNullOrWhiteSpace(l2)) mrzLike.Add(NormalizeRaw(l2));
                    }

                    if (mrzLike.Count >= 2)
                    {
                        line1 = NormalizeMrzLine(mrzLike[^2]);
                        line2 = NormalizeMrzLine(mrzLike[^1]);
                        if (line1.Length == 44 && line2.Length == 44) break;
                        line1 = line2 = null;
                    }
                }

                if (string.IsNullOrWhiteSpace(line1) || string.IsNullOrWhiteSpace(line2))
                {
                    Console.Error.WriteLine("Could not locate two MRZ lines in OCR result.");
                    return null;
                }
                MrzParser parser = new MrzParser();
                var PassportInfo = parser.ParseTd3(line1!, line2!);

                Console.WriteLine("=== MRZ Extracted ===");

                Console.WriteLine("=== Parsed Fields ===");
                Console.WriteLine($"Issuer:     {PassportInfo.Issuer}");
                Console.WriteLine($"FullName:  {PassportInfo.FullName}");
                Console.WriteLine($"Passport:  {PassportInfo.PassportNumber} ");
                Console.WriteLine($"Nationality:{PassportInfo.Nationality}");
                Console.WriteLine($"DOB:        {PassportInfo.DateOfBirth:yyyy-MM-dd} ");
                Console.WriteLine($"Sex:        {PassportInfo.Sex}");
                Console.WriteLine($"Expiry:     {PassportInfo.ExpiryDate:yyyy-MM-dd}");
                Console.WriteLine($"Composite Check: {PassportInfo.CompositeCheck}");

                return PassportInfo;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error: " + ex.Message);
                Console.Error.WriteLine(ex.StackTrace);
                return null;
            }
        }


        private TesseractEngine CreateEngine(string tessdataPath, string languages)
        {
            var engine = new TesseractEngine(tessdataPath, languages, EngineMode.LstmOnly);
            engine.SetVariable("tessedit_char_whitelist", "ABCDEFGHIJKLMNOPQRSTUVWXYZ<0123456789");
            engine.SetVariable("load_system_dawg", "0");
            engine.SetVariable("load_freq_dawg", "0");
            return engine;
        }

        private Rect GetBottomRect(Pix pix, float bottomFraction)
        {
            bottomFraction = Math.Clamp(bottomFraction, 0.10f, 0.60f);
            int h = pix.Height, w = pix.Width;
            int roiH = Math.Max(1, (int)(h * bottomFraction));
            return new Rect(0, h - roiH, w, roiH);
        }

        private (Rect band1, Rect band2) SliceMrzBands(Rect roi)
        {
            int h = roi.Height, w = roi.Width;
            int bandHeight = Math.Max(1, (int)(h * 0.48));
            int gap = h - bandHeight * 2;
            int y1 = roi.Y1 + Math.Max(0, gap / 2);
            int y2 = y1 + bandHeight;
            return (new Rect(roi.X1, y1, w, bandHeight),
                    new Rect(roi.X1, y2, w, bandHeight));
        }

        private List<string> OcrLinesFromRect(TesseractEngine engine, Pix fullPix, Rect rect)
        {
            using var page = engine.Process(fullPix, rect);
            using var it = page.GetIterator();
            var lines = new List<string>();
            it.Begin();

            bool hasTextLine = false;
            do
            {
                var t = it.GetText(PageIteratorLevel.TextLine);
                if (!string.IsNullOrWhiteSpace(t))
                {
                    lines.Add(t);
                    hasTextLine = true;
                }
            } while (it.Next(PageIteratorLevel.TextLine));

            if (!hasTextLine)
            {
                var all = page.GetText();
                if (!string.IsNullOrWhiteSpace(all))
                    lines.AddRange(all.Split('\n'));
            }
            return lines;
        }

        private string? OcrSingleLine(TesseractEngine engine, Pix fullPix, Rect rect)
        {
            var prev = engine.DefaultPageSegMode;
            engine.DefaultPageSegMode = PageSegMode.SingleLine;
            try
            {
                using var page = engine.Process(fullPix, rect);
                return page.GetText();
            }
            catch
            {
                return null;
            }
            finally
            {
                engine.DefaultPageSegMode = prev;
            }
        }

        private List<string> FilterMrzLike(List<string> lines)
        {
            var list = new List<string>();
            foreach (var l in lines)
            {
                var n = NormalizeRaw(l);
                int chevrons = 0; foreach (var c in n) if (c == '<') chevrons++;
                if (n.Length >= 35 && chevrons >= 5)
                    list.Add(n);
            }
            return list;
        }

        private string NormalizeRaw(string s)
            => s.Trim().Replace(" ", "").Replace("\r", "").Replace("\t", "").ToUpperInvariant();

        private string NormalizeMrzLine(string s)
        {
            s = NormalizeRaw(s);
            if (s.Length < 44) s = s.PadRight(44, '<');
            else if (s.Length > 44) s = s.Substring(0, 44);
            return s;
        }

    }
}


