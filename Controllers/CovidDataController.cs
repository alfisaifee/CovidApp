using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyFirstApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CovidDataController : ControllerBase
    {
        [HttpGet]
        public IList<Country> Get()
        {
            CovidData covidData = new CovidData();
            HttpClient client = new HttpClient
            {
                BaseAddress = new Uri("https://api.covid19api.com/")
            };

            HttpResponseMessage response = client.GetAsync("summary").Result;
            if (response.IsSuccessStatusCode)
            {
                covidData = JsonConvert.DeserializeObject<CovidData>(response.Content.ReadAsStringAsync().Result);
            }
            else
            {
                Debug.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
            }

            IList<Country> countries = covidData.Countries;
            return countries;
        }
    }
}
