const { Position } = require("reactflow");

const input = [
  {
    id: "39100953-1e14-4246-892a-cc4dc6f58e23",
    name: "Төре",
    parent: null,
    children: [
      {
        id: "740ab7bd-b49e-48e6-9027-2d11b0807ba0",
        name: "Шыңғыс хан",
        children: [
          {
            id: "5daaea9a-21b5-4b0a-af09-e61ca602d7ae",
            name: "Жошы",
            children: [
              {
                id: "05ba38c6-f365-4823-ae27-13b0bfe759a3",
                name: "Таңғұт"
              },
              {
                id: "0f6ec336-e9c1-4618-8eac-dd857fe3283a",
                name: "Беркешар"
              },
              {
                id: "26eb0ea8-deb4-4778-9ee7-61df480133ed",
                name: "Удир"
              },
              {
                id: "2a265ae1-41b0-4ff7-b5d3-db9d5ba07547",
                name: "Шайбани"
              },
              {
                id: "322d4044-4f92-47c7-bfb8-6737644cee58",
                name: "Орда Ежен"
              },
              {
                id: "384d7d9f-3365-48f4-aff1-0c0511af30fa",
                name: "Тоқай темір"
              },
              {
                id: "7486af13-9003-4802-a0d3-9ea1ccdfb5b2",
                name: "Саңғұм"
              },
              {
                id: "8780c574-596d-4aa5-a178-b35c6247bdc9",
                name: "Берке"
              },
              {
                id: "95e0b60c-c048-4ef6-b1c1-67b30369d6f6",
                name: "Бату"
              },
              {
                id: "95f6aa37-9e1b-4d1e-9f0f-6464b25af22d",
                name: "Шымбай"
              },
              {
                id: "bb7d6514-4131-4fb4-856d-906ad6821c59",
                name: "Бууал"
              },
              {
                id: "cfc2381f-d046-49bc-a0cd-d34e87f0ac0b",
                name: "Шылаукүн"
              },
              {
                id: "d4d67544-db65-4bd8-a404-c4edf714e63f",
                name: "Сұңқар"
              },
              {
                id: "ee7b9c4a-ab97-46bb-820d-195991b18e4f",
                name: "Мұхаммед"
              }
            ]
          },
          {
            id: "6eb0699a-b008-4d3b-89eb-9ce553e9aa23",
            name: "Үгедей",
            children: [
              {
                id: "16dbc5c6-f281-45c4-a2bc-df924d03ff21",
                name: "Гүйік"
              },
              {
                id: "305b0756-70e2-402a-9968-d7da940c9fff",
                name: "Қашы"
              },
              {
                id: "55cc3c73-4c15-4d23-8f07-1ac462b67938",
                name: "Қодан"
              },
              {
                id: "ab28d323-d313-4e68-a430-fe75f53a66c8",
                name: "Күшү"
              },
              {
                id: "adae2fc2-cc7f-4ad5-a114-254d14464a79",
                name: "Қадан"
              }
            ]
          },
          {
            id: "b29f51ce-c663-4a93-bf8a-202a423fc6ca",
            name: "Төле",
            children: [
              {
                id: "341818e7-5234-42d9-8033-8eb4e0998bca",
                name: "Хулағу"
              },
              {
                id: "39fed5e1-c9af-44fa-b523-c4ca9880cf87",
                name: "Арық-Бұға"
              },
              {
                id: "7cb102bf-fbbd-47cb-bc1a-80342e95a132",
                name: "Құбылай"
              },
              {
                id: "e595a17c-f6f3-48cc-8239-5deec62e35d2",
                name: "Мөңке"
              }
            ]
          },
          {
            id: "b3a05c3b-3b31-497b-b14c-1bb9baf34f65",
            name: "Шағатай",
            children: [
              {
                id: "09c297da-5539-4203-b63f-61c359a6b434",
                name: "Мужи Яя"
              },
              {
                id: "13af9344-338c-4bf0-af08-ba749c66277a",
                name: "Есу-Мункэ"
              },
              {
                id: "6835e661-c31e-4b71-b661-6947bf5e65b2",
                name: "Сарубан"
              },
              {
                id: "7d9ee8b3-2b68-4b85-9caa-f7be0fc242fb",
                name: "Байдар"
              },
              {
                id: "fbbd2ce4-0b33-4fe3-9802-7fd7e92b60b5",
                name: "Мутугэн"
              }
            ]
          }
        ]
      }
    ]
  }
];

let nodes = [];
let edges = [];
let position = { x: 0, y: 0 };
let edgeType = "bezier";

const pastelColors = [
  "#FFD1DC", // Pastel Pink
  "#FFB347", // Pastel Orange
  "#FFFF66", // Pastel Yellow
  "#B5EAAA", // Pastel Green
  "#99CCCC", // Pastel Blue
  "#C5A3FF", // Pastel Purple
  "#FFCC99", // Pastel Peach
  "#FFCBDB", // Pastel Rose
  "#D1F2EB", // Pastel Mint
  "#D6EAF8" // Pastel Sky
];

function traverse(node, parentId = null, level = 0) {
  nodes.push({
    id: node.id,
    data: { label: node.name, level },
    type: "custom",
    position
  });

  if (parentId) {
    edges.push({
      id: `e${parentId}${node.id}`,
      source: parentId,
      target: node.id,
      type: edgeType,
      style: {
        stroke: pastelColors[level]
      },
      animated: true
    });
  }

  if (node.children) {
    for (let child of node.children) {
      traverse(child, node.id, level + 1);
    }
  }
}

for (let node of input) {
  traverse(node);
}

console.log("Nodes:", nodes);
console.log("Edges:", edges);

module.exports = { nodes, edges };
