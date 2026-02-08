export const catalog = [
  {
    id: "john-deere",
    name: "John Deere",
    models: [
      {
        id: "s780",
        name: "S780",
        systems: [
          {
            id: "motor",
            name: "Motor",
            products: [
              {
                id: "filtro-aceite",
                name: "Filtro de aceite",
                code: "ENG-001",
                description: "Filtro de aceite compatible con motores agrícolas.",
                stock: true,
                image: "/images/filtro-aceite.jpg",
              },
              {
                id: "bomba-agua",
                name: "Bomba de agua",
                code: "ENG-002",
                description: "Bomba de agua para sistema de refrigeración.",
                stock: false,
                image: "/images/bomba-agua.jpg",
              },
              {
                id: "correa-ventilador",
                name: "Correa de ventilador",
                code: "ENG-003",
                description: "Correa reforzada para sistema de ventilación del motor.",
                stock: true,
                image: "/images/correa.jpg",
              },
              {
                id: "radiador",
                name: "Radiador completo",
                code: "ENG-004",
                description: "Radiador de alto rendimiento para cosechadoras.",
                stock: true,
                image: "/images/radiador.jpg",
              },
            ],
          },
          {
            id: "transmision",
            name: "Transmisión",
            products: [
              {
                id: "embrague",
                name: "Kit de embrague",
                code: "TR-001",
                description: "Kit completo de embrague para transmisión pesada.",
                stock: true,
                image: "/images/embrague.jpg",
              },
              {
                id: "caja-cambios",
                name: "Caja de cambios",
                code: "TR-002",
                description: "Caja de cambios original John Deere.",
                stock: false,
                image: "/images/caja-cambios.jpg",
              },
            ],
          },
        ],
      },
      {
        id: "x9-1000",
        name: "X9 1000",
        systems: [
          {
            id: "hidraulico",
            name: "Sistema Hidráulico",
            products: [
              {
                id: "bomba-hidraulica",
                name: "Bomba hidráulica",
                code: "HYD-001",
                description: "Bomba hidráulica de alto caudal.",
                stock: true,
                image: "/images/bomba-hidraulica.jpg",
              },
              {
                id: "valvula-control",
                name: "Válvula de control",
                code: "HYD-002",
                description: "Válvula de control para sistema hidráulico.",
                stock: false,
                image: "/images/valvula.jpg",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "new-holland",
    name: "New Holland",
    models: [
      {
        id: "cr890",
        name: "CR8.90",
        systems: [
          {
            id: "motor",
            name: "Motor",
            products: [
              {
                id: "alternador",
                name: "Alternador",
                code: "ELE-001",
                description: "Alternador reforzado.",
                stock: false,
                image: "/images/alternador.jpg",
              },
              {
                id: "motor-arranque",
                name: "Motor de arranque",
                code: "ELE-002",
                description: "Motor de arranque de alta potencia.",
                stock: true,
                image: "/images/motor-arranque.jpg",
              },
            ],
          },
          {
            id: "corte",
            name: "Sistema de Corte",
            products: [
              {
                id: "cuchilla",
                name: "Cuchilla de corte",
                code: "CUT-001",
                description: "Cuchilla reforzada para cosecha intensiva.",
                stock: true,
                image: "/images/cuchilla.jpg",
              },
              {
                id: "barra-corte",
                name: "Barra de corte",
                code: "CUT-002",
                description: "Barra de corte de precisión.",
                stock: false,
                image: "/images/barra-corte.jpg",
              },
            ],
          },
        ],
      },
    ],
  },
    {
    id: "franco-fabril",
    name: "Franco Fabril",
    models: [
      {
        id: "axial-9250",
        name: "Axial-Flow 9250",
        systems: [
          {
            id: "motor",
            name: "Motor",
            products: [
              {
                id: "filtro-combustible-case",
                name: "Filtro de combustible",
                code: "ENG-101",
                description: "Filtro de combustible original para motor Franco Fabril.",
                stock: true,
                image: "/images/filtro-combustible.jpg",
              },
              {
                id: "inyector-case",
                name: "Inyector electrónico",
                code: "ENG-102",
                description: "Inyector de alta precisión para motores agrícolas.",
                stock: false,
                image: "/images/inyector.jpg",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "massey-ferguson",
    name: "Massey Ferguson",
    models: [
      {
        id: "mf-7720",
        name: "MF 7720",
        systems: [
          {
            id: "transmision",
            name: "Transmisión",
            products: [
              {
                id: "kit-embrague-mf",
                name: "Kit de embrague",
                code: "TR-201",
                description: "Kit completo de embrague para Massey Ferguson.",
                stock: true,
                image: "/images/embrague.jpg",
              },
              {
                id: "eje-transmision-mf",
                name: "Eje de transmisión",
                code: "TR-202",
                description: "Eje de transmisión reforzado para trabajo pesado.",
                stock: false,
                image: "/images/eje.jpg",
              },
            ],
          },
        ],
      },
    ],
  }

]

