import kuduImg from "@/assets/animals/kudu.jpg";
import impalaImg from "@/assets/animals/impala.jpg";
import wildebeestImg from "@/assets/animals/wildebeest.jpg";
import warthogImg from "@/assets/animals/warthog.jpg";
import zebraImg from "@/assets/animals/zebra.jpg";
import springbokImg from "@/assets/animals/springbok.jpg";
import sableImg from "@/assets/animals/sable.jpg";
import elandImg from "@/assets/animals/eland.jpg";
import waterbuckImg from "@/assets/animals/waterbuck.jpg";
import nyalaImg from "@/assets/animals/nyala.jpg";
import bushbuckImg from "@/assets/animals/bushbuck.jpg";
import reedbuckImg from "@/assets/animals/reedbuck.jpg";
import tsessebeImg from "@/assets/animals/tsessebe.jpg";
import giraffeImg from "@/assets/animals/giraffe.jpg";
import duikerImg from "@/assets/animals/duiker.jpg";
import steenbokImg from "@/assets/animals/steenbok.jpg";
import buffaloImg from "@/assets/animals/buffalo.jpg";
import elephantImg from "@/assets/animals/elephant.jpg";
import baboonImg from "@/assets/animals/baboon.jpg";
import hartebeestImg from "@/assets/animals/hartebeest.jpg";
import bushpigImg from "@/assets/animals/bushpig.jpg";
import klipspringerImg from "@/assets/animals/klipspringer.jpg";
import blesbuckImg from "@/assets/animals/blesbuck.jpg";

export type Diet = "Grazer" | "Browser" | "Mixed Feeder" | "Omnivore";

export interface Animal {
  id: number;
  name: string;
  latinName: string;
  afrikaans: string;
  shona: string;
  habitat: string;
  diet: Diet;
  range: string;
  description: string;
  image: string;
  category: "Plains Game" | "Dangerous Game" | "Big Game" | "Small Game";
}

export const animals: Animal[] = [
  {
    id: 1,
    name: "Greater Kudu",
    latinName: "Tragelaphus strepsiceros",
    afrikaans: "Koedoe",
    shona: "Nhoro",
    habitat: "Mixed woodland, mopane scrub, rocky hillsides",
    diet: "Browser",
    range: "Throughout Zimbabwe, Southern & East Africa",
    description:
      "The Grey Ghost of Africa. Renowned for its magnificent spiral horns, the Greater Kudu is the most prized antelope on a Southern African plains hunt. Bulls move silently through thick bushveld and demand patience and skill from the hunter.",
    image: kuduImg,
    category: "Plains Game",
  },
  {
    id: 2,
    name: "Impala",
    latinName: "Aepyceros melampus",
    afrikaans: "Rooibok",
    shona: "Mhara",
    habitat: "Open woodland and savanna edge",
    diet: "Mixed Feeder",
    range: "Most of Southern Africa",
    description:
      "Graceful, abundant and the staple of any African plains-game safari. Impala rams carry elegant lyre-shaped horns and provide excellent meat for camp.",
    image: impalaImg,
    category: "Plains Game",
  },
  {
    id: 3,
    name: "Blue Wildebeest",
    latinName: "Connochaetes taurinus",
    afrikaans: "Blouwildebees",
    shona: "Mvumba",
    habitat: "Open grassland and short-grass plains",
    diet: "Grazer",
    range: "Zimbabwe, South Africa, Botswana, Namibia",
    description:
      "Built like a small bull and famed for being tough to bring down. The blue wildebeest is a quintessential African trophy demanding well-placed shots.",
    image: wildebeestImg,
    category: "Plains Game",
  },
  {
    id: 4,
    name: "Warthog",
    latinName: "Phacochoerus africanus",
    afrikaans: "Vlakvark",
    shona: "Njiri",
    habitat: "Savanna grassland and scrub",
    diet: "Omnivore",
    range: "Sub-Saharan Africa",
    description:
      "Bold, comical, and surprisingly tough. Old warthog boars carry impressive curved tusks that make for a striking trophy.",
    image: warthogImg,
    category: "Plains Game",
  },
  {
    id: 5,
    name: "Burchell's Zebra",
    latinName: "Equus burchellii",
    afrikaans: "Bontkwagga",
    shona: "Mbizi",
    habitat: "Open grassland and savanna",
    diet: "Grazer",
    range: "Southern Africa",
    description:
      "Striking, tough, and wary. Zebra are highly alert herd animals that test the hunter's stalking ability. Their hide is one of the most beautiful trophies in Africa.",
    image: zebraImg,
    category: "Plains Game",
  },
  {
    id: 6,
    name: "Springbok",
    latinName: "Antidorcas marsupialis",
    afrikaans: "Springbok",
    shona: "Insephe",
    habitat: "Open arid plains and short grassland",
    diet: "Mixed Feeder",
    range: "Southern Africa, mainly RSA, Namibia, Botswana",
    description:
      "South Africa's national antelope. Small, quick, and famous for its pronking display. A classic Karoo plains-game hunt.",
    image: springbokImg,
    category: "Plains Game",
  },
  {
    id: 7,
    name: "Sable",
    latinName: "Hippotragus niger",
    afrikaans: "Swartwitpens",
    shona: "Mharapara",
    habitat: "Wooded savanna with access to water",
    diet: "Grazer",
    range: "Zimbabwe, Zambia, parts of South Africa",
    description:
      "Many hunters' dream trophy. Jet-black bulls with sweeping scimitar horns. Zimbabwe is one of the finest destinations on earth for sable.",
    image: sableImg,
    category: "Plains Game",
  },
  {
    id: 8,
    name: "Eland",
    latinName: "Taurotragus oryx",
    afrikaans: "Eland",
    shona: "Mhofu",
    habitat: "Open woodland, savanna and grassland",
    diet: "Mixed Feeder",
    range: "Southern and East Africa",
    description:
      "The largest antelope in the world. Mature bulls weigh nearly a ton, making the eland a true endurance hunt and an exceptional trophy.",
    image: elandImg,
    category: "Plains Game",
  },
  {
    id: 9,
    name: "Waterbuck",
    latinName: "Kobus ellipsiprymnus",
    afrikaans: "Waterbok",
    shona: "Dhumukwa",
    habitat: "Always near permanent water and floodplains",
    diet: "Grazer",
    range: "Zimbabwe, Zambia, Mozambique",
    description:
      "Heavy, regal, and easily identified by the white ring on its rump. Bulls carry long ridged horns and command respect.",
    image: waterbuckImg,
    category: "Plains Game",
  },
  {
    id: 10,
    name: "Nyala",
    latinName: "Tragelaphus angasii",
    afrikaans: "Njala",
    shona: "Inyala",
    habitat: "Dense lowland woodland and thickets",
    diet: "Browser",
    range: "South-east Zimbabwe, Mozambique, KwaZulu-Natal",
    description:
      "One of Africa's most beautiful antelope. Shy and seldom seen in the open, nyala demand a patient stalk in thick bush.",
    image: nyalaImg,
    category: "Plains Game",
  },
  {
    id: 11,
    name: "Bushbuck",
    latinName: "Tragelaphus scriptus",
    afrikaans: "Bosbok",
    shona: "Dzoma",
    habitat: "Riverine forest and dense thickets",
    diet: "Browser",
    range: "Throughout sub-Saharan Africa",
    description:
      "Pound for pound the bravest small antelope in Africa. Old rams are wary, dangerous when wounded, and a highly respected trophy.",
    image: bushbuckImg,
    category: "Small Game",
  },
  {
    id: 12,
    name: "Reedbuck",
    latinName: "Redunca arundinum",
    afrikaans: "Rietbok",
    shona: "Tsva",
    habitat: "Vleis, reed beds and grasslands near water",
    diet: "Grazer",
    range: "Eastern and Southern Africa",
    description:
      "A specialist of wet grassland. Common reedbuck rams carry forward-curving horns and are typically hunted at dawn.",
    image: reedbuckImg,
    category: "Plains Game",
  },
  {
    id: 13,
    name: "Tsessebe",
    latinName: "Damaliscus lunatus",
    afrikaans: "Tsessebe",
    shona: "Inyamayentanda",
    habitat: "Open and lightly wooded grassland",
    diet: "Grazer",
    range: "Zimbabwe, Botswana, parts of Zambia",
    description:
      "Among the fastest antelope in Africa. Tsessebe are uncommon, making them one of the most sought-after plains-game trophies.",
    image: tsessebeImg,
    category: "Plains Game",
  },
  {
    id: 14,
    name: "Giraffe",
    latinName: "Giraffa camelopardalis",
    afrikaans: "Kameelperd",
    shona: "Twiza",
    habitat: "Acacia woodland and savanna",
    diet: "Browser",
    range: "Sub-Saharan Africa",
    description:
      "The world's tallest mammal. Mature bulls are taken on selective management hunts and yield extraordinary capes.",
    image: giraffeImg,
    category: "Big Game",
  },
  {
    id: 15,
    name: "Duiker",
    latinName: "Cephalophus sp.",
    afrikaans: "Duiker",
    shona: "Mhembwe",
    habitat: "Forest, thicket and bushveld edge",
    diet: "Browser",
    range: "Throughout Zimbabwe",
    description:
      "Small, secretive forest antelope often seen darting across roads at dusk. A challenging stalk in dense cover.",
    image: duikerImg,
    category: "Small Game",
  },
  {
    id: 16,
    name: "Steenbok",
    latinName: "Raphicerus campestris",
    afrikaans: "Steenbok",
    shona: "Hwiriri",
    habitat: "Open grassland and dry scrub",
    diet: "Mixed Feeder",
    range: "Southern and Eastern Africa",
    description:
      "Tiny, alert and beautifully proportioned. The smallest commonly hunted antelope, prized for its elegance.",
    image: steenbokImg,
    category: "Small Game",
  },
  {
    id: 17,
    name: "Buffalo",
    latinName: "Syncerus caffer",
    afrikaans: "Buffel",
    shona: "Nyati",
    habitat: "Mopane woodland, riverine bush and floodplain",
    diet: "Grazer",
    range: "Zimbabwe, Zambia, Mozambique, Tanzania",
    description:
      "Black Death. The Cape buffalo is the most demanded of Africa's Dangerous Seven. Hunting old dagga boys requires nerve, a heavy rifle, and a calm finger.",
    image: buffaloImg,
    category: "Dangerous Game",
  },
  {
    id: 18,
    name: "Elephant",
    latinName: "Loxodonta africana",
    afrikaans: "Olifant",
    shona: "Nzou",
    habitat: "Mopane woodland, river systems, miombo",
    diet: "Mixed Feeder",
    range: "Zimbabwe holds one of Africa's largest populations",
    description:
      "The grandest hunt on the continent. Strictly licensed and managed under CITES quotas, an elephant hunt in Zimbabwe is a once-in-a-lifetime pursuit.",
    image: elephantImg,
    category: "Dangerous Game",
  },
  {
    id: 19,
    name: "Baboon",
    latinName: "Papio sp.",
    afrikaans: "Bobbejaan",
    shona: "Gudo",
    habitat: "Rocky kopjes, woodland and farmland edges",
    diet: "Omnivore",
    range: "Throughout sub-Saharan Africa",
    description:
      "Cunning, observant and notoriously difficult to approach. Often hunted as a problem-animal trophy with a long, careful stalk.",
    image: baboonImg,
    category: "Small Game",
  },
  {
    id: 20,
    name: "Hartebeest",
    latinName: "Alcelaphus buselaphus",
    afrikaans: "Hartbees",
    shona: "Hayibhisi",
    habitat: "Open grassland and short-grass plains",
    diet: "Grazer",
    range: "Southern Africa",
    description:
      "Long-faced, high-shouldered and surprisingly fast. Old bulls become solitary and provide a tough plains-game trophy.",
    image: hartebeestImg,
    category: "Plains Game",
  },
  {
    id: 21,
    name: "Bushpig",
    latinName: "Potamochoerus larvatus",
    afrikaans: "Bosvark",
    shona: "Humba",
    habitat: "Riverine forest and dense bush",
    diet: "Omnivore",
    range: "Eastern Zimbabwe and the Eastern Highlands",
    description:
      "Largely nocturnal and rarely seen. Hunted with hounds or over bait at night. A formidable, aggressive trophy.",
    image: bushpigImg,
    category: "Small Game",
  },
  {
    id: 22,
    name: "Klipspringer",
    latinName: "Oreotragus oreotragus",
    afrikaans: "Klipspringer",
    shona: "Ngururu",
    habitat: "Rocky kopjes and granite outcrops",
    diet: "Browser",
    range: "Matobo Hills and rocky country across Zimbabwe",
    description:
      "Tip-toe rock antelope of the kopjes. Spotted from a distance and stalked across granite — one of Africa's most distinctive small-game trophies.",
    image: klipspringerImg,
    category: "Small Game",
  },
  {
    id: 23,
    name: "Blesbuck",
    latinName: "Damaliscus pygargus phillipsi",
    afrikaans: "Blesbok",
    shona: "Bhulesibhokisi",
    habitat: "Highveld grassland",
    diet: "Grazer",
    range: "South African highveld, introduced to parts of Zimbabwe",
    description:
      "Identified by the distinctive white blaze down the face. A handsome and accessible plains-game trophy.",
    image: blesbuckImg,
    category: "Plains Game",
  },
];
