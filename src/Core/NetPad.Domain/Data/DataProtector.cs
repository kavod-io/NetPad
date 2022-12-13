using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.DataProtection;

namespace NetPad.Data;

public class DataProtector : IDataProtector, IDataConnectionPasswordProtector
{
    private readonly IDataProtector _protector;

    public DataProtector(IDataProtectionProvider dataProtectionProvider, string purpose)
    {
        _protector = dataProtectionProvider.CreateProtector(purpose);
    }

    public IDataProtector CreateProtector(string purpose) => _protector.CreateProtector(purpose);

    public byte[] Protect(byte[] plaintext) => _protector.Protect(plaintext);
    public string Protect(string plaintext) => _protector.Protect(plaintext);

    public byte[] Unprotect(byte[] protectedData) => _protector.Unprotect(protectedData);
    public string Unprotect(string protectedData) => _protector.Unprotect(protectedData);

    public bool TryUnprotect(byte[] protectedData, [MaybeNullWhen(false)] out byte[] unprotectedData)
    {
        try
        {
            unprotectedData = _protector.Unprotect(protectedData);
            return true;
        }
        catch
        {
            unprotectedData = null;
            return false;
        }
    }

    public bool TryUnprotect(string protectedData, [MaybeNullWhen(false)] out string unprotectedData)
    {
        try
        {
            unprotectedData = _protector.Unprotect(protectedData);
            return true;
        }
        catch
        {
            unprotectedData = null;
            return false;
        }
    }
}
