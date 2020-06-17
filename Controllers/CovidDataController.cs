using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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
        public CovidData Get()
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
                //covidData = JsonConvert.DeserializeObject<CovidData>(covidData1.ToString());
            }
            else
            {
                Debug.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
            }

            foreach (var country in covidData.Countries)
            {
                string continent = this.GetContinent(country.CountryCode);
                country.Continent = continent;
            }

            return covidData;
        }

        private string GetContinent(string countryCode)
        {
            JObject items;
            using (StreamReader continents = new StreamReader("./Data/continents.json"))
            {
                string json = continents.ReadToEnd();
                items = (JObject)JsonConvert.DeserializeObject(json);
            }

            return items[countryCode].Value<string>();
        }
    }
}
