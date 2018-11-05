using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StarterPackHost.Utilities
{
    public class AzureResourceManagementCredentialsHelper
    {
        private const string ARM_URL = "https://management.core.windows.net";
        private ClaimsPrincipal _claimsPrincipal;
        private string _clientId;
        private string _clientSecret;
        private string _instance;

        public AzureResourceManagementCredentialsHelper(IConfiguration configuration, ClaimsPrincipal claimsPrincipal)
        {
            this._clientId = configuration["AzureAd:ClientId"];
            this._clientSecret = configuration["AzureAd:ClientSecret"];
            this._claimsPrincipal = claimsPrincipal;
            this._instance = configuration["AzureAd:Instance"];
        }

        public async Task<string> GetArmBearerToken()
        {
            var token = this._claimsPrincipal.Identities.First().BootstrapContext as String;
            var userIdentifier = GetClaimsPrincipalIdentifier();
            var authContext = new AuthenticationContext(this._instance);
            var credential = new ClientCredential(this._clientId, this._clientSecret);
            var userAssertion = new UserAssertion(token, "urn:ietf:params:oauth:grant-type:jwt-bearer", userIdentifier);
            var result = await authContext.AcquireTokenAsync(ARM_URL, credential, userAssertion);

            return result.AccessToken;
        }

        private string GetClaimsPrincipalIdentifier()
        {
            string signedInUserUniqueName = this._claimsPrincipal.FindFirst(ClaimTypes.Name).Value.Split('#')[this._claimsPrincipal.FindFirst(ClaimTypes.Name).Value.Split('#').Length - 1];
            return signedInUserUniqueName;
        }
    }
}
