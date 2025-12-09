using System.Security.Cryptography;


Console.WriteLine("Hello, World!");



var key = new byte[32];
var iv = new byte[16];  
RandomNumberGenerator.Fill(key);
RandomNumberGenerator.Fill(iv);

Console.WriteLine("Key: " + Convert.ToBase64String(key));
Console.WriteLine("IV: " + Convert.ToBase64String(iv));



string imagePath = @"C:\Users\10020821\OneDrive - ERGO Group AG\Documents\TravelManagementProject\DataTravelManagement\pass2.png";

static byte[] ImageToBytes(string imagePath)
{
    if (string.IsNullOrWhiteSpace(imagePath))
        throw new ArgumentException("Image path cannot be null or empty.", nameof(imagePath));

    if (!File.Exists(imagePath))
        throw new FileNotFoundException($"Image not found at path: {imagePath}");

    return File.ReadAllBytes(imagePath);
}
byte[] bytes = ImageToBytes(imagePath);
Console.WriteLine("Image converted to byte array. Size: " + bytes + " bytes");

//OcrServices ocrServices = new OcrServices();
//ocrServices.OCR(bytes);