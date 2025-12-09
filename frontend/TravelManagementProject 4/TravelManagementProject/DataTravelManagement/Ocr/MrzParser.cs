
using System.Globalization;

using DataTravelManagement.Model;

namespace DataTravelManagement.Ocr
{
    public class MrzParser
    {
        public  PassportInfoMaster ParseTd3(string line1, string line2)
        {
            if (line1 == null) throw new ArgumentNullException(nameof(line1));
            if (line2 == null) throw new ArgumentNullException(nameof(line2));

            line1 = NormalizeLine(line1);
            line2 = NormalizeLine(line2);

            if (line1.Length != 44) throw new ArgumentException("MRZ Line 1 must be exactly 44 characters.");
            if (line2.Length != 44) throw new ArgumentException("MRZ Line 2 must be exactly 44 characters.");

            string issuingState = line1.Substring(2, 3);

            string nameField = line1.Substring(5);
            string[] nameParts = nameField.Split(new[] { "<<" }, StringSplitOptions.None);
            string primaryId = CleanMrzText(nameParts.ElementAtOrDefault(0));
            string secondaryId = CleanMrzText(nameParts.ElementAtOrDefault(1));

            string passportNumber = line2.Substring(0, 9);
            char passportNumCheck = line2[9];
            string nationality = line2.Substring(10, 3);

            string dobRaw = line2.Substring(13, 6);
            char dobCheck = line2[19];

            char sexChar = line2[20];

            string expRaw = line2.Substring(21, 6);
            char expCheck = line2[27];

            string personalNumber = line2.Substring(28, 14);
            char personalCheck = line2[42];

            char compositeCheck = line2[43];

            bool passNumOk = CheckDigit(passportNumber) == passportNumCheck;
            bool dobOk = CheckDigit(dobRaw) == dobCheck;
            bool expOk = CheckDigit(expRaw) == expCheck;
            bool personalOk = CheckDigit(personalNumber) == personalCheck;

            string compositeSource = passportNumber + passportNumCheck + dobRaw + dobCheck + expRaw + expCheck + personalNumber + personalCheck;
            bool compositeOk = CheckDigit(compositeSource) == compositeCheck;

            DateTime? dob = ParseYYMMDD(dobRaw);
            DateTime? exp = ParseYYMMDD(expRaw);

            return new PassportInfoMaster
            {
              
                Issuer = issuingState,
                FullName =secondaryId +" "+primaryId ,
                PassportNumber = passportNumber.Replace("<", string.Empty),
                Nationality = nationality,
                DateOfBirth = dob,
                Sex = sexChar == '<' ? 'X' : sexChar,
                ExpiryDate = exp,
                CompositeCheck = compositeOk
            };
        }
        private  string NormalizeLine(string s)
        {
            s = s.Trim().Replace(" ", "");
            s = s.ToUpperInvariant();
            if (s.Length < 44) s = s.PadRight(44, '<');
            else if (s.Length > 44) s = s.Substring(0, 44);
            return s;
        }

        private  string CleanMrzText(string? s)
            => string.IsNullOrEmpty(s) ? string.Empty
               : s.Replace('<', ' ').Trim().Replace("  ", " ");

        private  char CheckDigit(string field)
        {
            int[] weights = { 7, 3, 1 };
            int sum = 0;
            for (int i = 0; i < field.Length; i++)
            {
                int val = MrzCharValue(field[i]);
                sum += val * weights[i % 3];
            }
            return (char)('0' + (sum % 10));
        }

        private  int MrzCharValue(char c)
        {
            if (c >= '0' && c <= '9') return c - '0';
            if (c >= 'A' && c <= 'Z') return c - 'A' + 10;
            if (c == '<') return 0;
            char up = char.ToUpperInvariant(c);
            if (up >= 'A' && up <= 'Z') return up - 'A' + 10;
            throw new ArgumentException($"Invalid MRZ character: '{c}'");
        }

        private  DateTime? ParseYYMMDD(string yymmdd)
        {
            if (yymmdd.Length != 6 || !yymmdd.All(char.IsDigit)) return null;

            int yy = int.Parse(yymmdd.Substring(0, 2), CultureInfo.InvariantCulture);
            int mm = int.Parse(yymmdd.Substring(2, 2), CultureInfo.InvariantCulture);
            int dd = int.Parse(yymmdd.Substring(4, 2), CultureInfo.InvariantCulture);

            int year = (yy >= 50) ? (1900 + yy) : (2000 + yy);
            try { return new DateTime(year, mm, dd, 0, 0, 0, DateTimeKind.Utc); }
            catch { return null; }
        }
    }
}

