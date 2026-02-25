using System.Security.Cryptography;
using System.Text;

namespace DEEMPPORTAL.Domain
{
	public class Security
	{
		// The key and IV should be securely stored, 
		private static readonly byte[] Key; // 256 bits
		private static readonly byte[] IV; // 128 bits

		static Security()
		{
			var keyHex = "faded688f6d191cbfc8e162add0471ddb9770422dc1763a569f329ef68b8a3ed";
			var ivHex = "bc865147fea56a1a89b0bade59861254";

			Key = HexStringToByteArray(keyHex);
			IV = HexStringToByteArray(ivHex);
		}

		public static async Task<string> Encrypt(string password)
		{
			using var aes = Aes.Create();
			aes.Key = Key;
			aes.IV = IV;
			aes.Padding = PaddingMode.PKCS7;
			aes.Mode = CipherMode.CBC;

			using var encryptor = aes.CreateEncryptor();
			using var memoryStream = new MemoryStream();
			using var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);

			byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
			await cryptoStream.WriteAsync(passwordBytes, 0, passwordBytes.Length);
			await cryptoStream.FlushFinalBlockAsync();

			return Convert.ToBase64String(memoryStream.ToArray());
		}

		public static async Task<string> Decrypt(string encryptedPassword)
		{
			byte[] cipherText = Convert.FromBase64String(encryptedPassword);

			using var aes = Aes.Create();
			aes.Key = Key;
			aes.IV = IV;
			aes.Padding = PaddingMode.PKCS7;
			aes.Mode = CipherMode.CBC;

			using var decryptor = aes.CreateDecryptor();
			using var memoryStream = new MemoryStream(cipherText);
			using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
			using var streamReader = new StreamReader(cryptoStream);

			return await streamReader.ReadToEndAsync();
		}

		private static byte[] HexStringToByteArray(string hex)
		{
			if (hex.Length % 2 != 0)
				throw new ArgumentException("Invalid hex string length.");

			var bytes = new byte[hex.Length / 2];
			for (int i = 0; i < bytes.Length; i++)
			{
				bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
			}
			return bytes;
		}
	}
}
