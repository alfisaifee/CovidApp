export const continents = [
    { name: "Asia" },
    { name: "Africa" },
    { name: "Europe" },
    { name: "North America" },
    { name: "South America" },
    { name: "Oceania" },
]

export function getContinents() {
    return continents.filter(c => c);
}