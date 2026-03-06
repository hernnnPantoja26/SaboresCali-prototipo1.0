/**
 * data.js - Base de datos simulada de Sabores de Cali
 * Arquitectura: Capa de Datos (simulación servidor)
 * Patrón: Repository + Simulated API
 */

const DB = (() => {
  'use strict';

  // ── Datos base de platos ──────────────────────────────────────────────────
  const _dishes = [
    {
      id: 1,
      nombre: "Sancocho de Gallina",
      categoria: "Plato Fuerte",
      subcategoria: "Caldos y Sopas",
      descripcionCorta: "El alma reconfortante de la cocina vallecaucana, servido en celebraciones familiares desde tiempos coloniales.",
      historia: "El Sancocho de Gallina es considerado el plato emblema del Valle del Cauca. Su origen se remonta a la época colonial, cuando las familias afrodescendientes e indígenas fusionaron sus tradiciones culinarias con las españolas. La gallina criolla, criada en los solares de las casas campesinas, era reservada para las grandes ocasiones: bautizos, matrimonios y fiestas patronales. En Cali, cada familia guarda su propia receta como un tesoro, transmitiéndola de generación en generación. El hogao —sofrito de tomate y cebolla larga— es su firma inconfundible.",
      ingredientes: [
        { grupo: "Proteína", items: ["1 gallina criolla (2 kg aprox.)", "Huesos de res opcionales"] },
        { grupo: "Tubérculos y Verduras", items: ["2 mazorcas partidas", "500g papa criolla", "300g yuca", "2 plátanos verdes", "1 cidra o guatila"] },
        { grupo: "Hierbas y Aromáticos", items: ["Cilantro cimarrón (cilantrón)", "Guascas secas", "Cebolla larga", "Ajo machacado", "Comino al gusto"] },
        { grupo: "Hogao", items: ["3 tomates chonto", "2 cebollas largas", "Aceite con achiote", "Sal al gusto"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Preparar la gallina", descripcion: "Lavar bien la gallina y cortarla en presas. Marinar con ajo, comino, sal y jugo de limón por 30 minutos." },
        { paso: 2, titulo: "Iniciar el caldo", descripcion: "En olla grande con 4 litros de agua fría, poner la gallina con cebolla larga, cilantro cimarrón y guascas. Llevar a hervor y espumar." },
        { paso: 3, titulo: "Agregar tubérculos", descripcion: "A los 30 minutos, incorporar la yuca, la mazorca y el plátano verde. Cocinar 20 minutos más." },
        { paso: 4, titulo: "Papa criolla y cidra", descripcion: "Añadir la papa criolla y la cidra pelada. Continuar la cocción por 20 minutos hasta que todo esté tierno." },
        { paso: 5, titulo: "Preparar el hogao", descripcion: "Sofreír tomate y cebolla larga picados en aceite con achiote hasta formar una salsa espesa y brillante. Reservar." },
        { paso: 6, titulo: "Servir", descripcion: "Servir el sancocho en plato hondo, acompañado de arroz blanco, hogao, aguacate y ají casero. Decorar con cilantro fresco." }
      ],
      imagen: "assets/images/SancochoWEBP",
      imagenAlt: "Sancocho de gallina vallecaucano servido en plato de barro con hogao y aguacate",
      video: "https://www.youtube.com/embed/6ir1iBf8n7k?si=5XK4-CXTpeh0rv1n",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Galería Alameda",
        direccion: "Calle 8 con Carrera 26, Cali",
        lat: 3.4453,
        lng: -76.5310,
        descripcion: "Mercado tradicional donde se consiguen los ingredientes frescos y los mejores sancochos caseros."
      },
      rating: 4.9,
      tiempoCoccion: "2 horas",
      dificultad: "Media",
      porciones: 8,
      destacado: true,
      tags: ["tradicional", "familiar", "festivo", "caldo"]
    },
    {
      id: 2,
      nombre: "Chuleta Valluna",
      categoria: "Plato Fuerte",
      subcategoria: "Carnes",
      descripcionCorta: "Chuleta de cerdo apanada a la perfección, símbolo de la parranda y la alegría caleña.",
      historia: "La Chuleta Valluna nació en los restaurantes populares del centro de Cali durante la década de 1950. Influenciada por técnicas de apanado europeas traídas por inmigrantes alemanes e italianos que se asentaron en el Valle del Cauca, pronto se fusionó con el sabor local del ají, el hogao y el patacón. Se convirtió en el plato favorito de las fiestas de quince años, los almuerzos dominicales y las fritangas callejeras. Su textura crujiente por fuera y jugosa por dentro la hacen inconfundible.",
      ingredientes: [
        { grupo: "Carne", items: ["4 chuletas de cerdo (250g c/u)", "Jugo de 2 limones", "4 dientes de ajo", "Comino molido", "Sal y pimienta"] },
        { grupo: "Apanado", items: ["2 huevos batidos", "Pan rallado fino (2 tazas)", "Harina de trigo (1 taza)"] },
        { grupo: "Acompañamientos", items: ["Patacones dobles", "Hogao", "Ensalada de repollo", "Arroz con coco"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Ablandar y marinar", descripcion: "Golpear las chuletas con mazo para ablandarlas. Marinar con ajo, limón, comino y sal por mínimo 1 hora." },
        { paso: 2, titulo: "Triple apanado", descripcion: "Pasar cada chuleta por harina, luego por huevo batido y finalmente por pan rallado. Repetir con huevo y pan para doble apanado." },
        { paso: 3, titulo: "Freír a fuego medio", descripcion: "En aceite profundo a 170°C, freír las chuletas 5-6 minutos por lado hasta dorar uniformemente. No superponer." },
        { paso: 4, titulo: "Escurrir y servir", descripcion: "Escurrir en papel absorbente. Servir con patacones, hogao, ensalada y arroz. Decorar con rodajas de limón." }
      ],
      imagen: "assets/images/Chuleta.webp",
      imagenAlt: "Chuleta valluna apanada y dorada con patacones y hogao sobre tabla de madera",
      video: "https://www.youtube.com/embed/-ZS04zeR6tw?si=FWJGXS992XmNjHs6",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Restaurante El Buen Sabor - Centro",
        direccion: "Carrera 10 #15-32, Centro, Cali",
        lat: 3.4516,
        lng: -76.5320,
        descripcion: "El corazón gastronómico del centro de Cali, donde la chuleta valluna es protagonista."
      },
      rating: 4.7,
      tiempoCoccion: "1.5 horas",
      dificultad: "Fácil",
      porciones: 4,
      destacado: true,
      tags: ["fritada", "cerdo", "crujiente", "popular"]
    },
    {
      id: 3,
      nombre: "Champús",
      categoria: "Bebida",
      subcategoria: "Bebidas Tradicionales",
      descripcionCorta: "Refrescante bebida ancestral de maíz, lulo y panela, herencia viva de la cocina precolombina caleña.",
      historia: "El Champús es una de las bebidas más antiguas de Colombia, con raíces precolombinas que se remontan a las culturas indígenas del Pacífico y el Valle del Cauca. Los cronistas coloniales lo describieron en el siglo XVI como una bebida ceremonial. Con el mestizaje, se incorporaron ingredientes como la panela, el lulo y las especias traídas de España. Hoy es inseparable de las festividades de Semana Santa en Cali, donde se vende en las calles en grandes ollas de barro. Su preparación requiere paciencia y conocimiento transmitido oralmente.",
      ingredientes: [
        { grupo: "Base", items: ["500g maíz mote pelado", "3 litros de agua", "300g panela rallada"] },
        { grupo: "Frutas", items: ["6 lulos maduros", "2 naranjas (jugo y ralladura)", "1 naranja agria"] },
        { grupo: "Especias", items: ["2 ramas canela", "4 clavos de olor", "Hojas de naranjo al gusto", "Pimienta de olor (2 unidades)"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Cocinar el maíz", descripcion: "Remojar el maíz mote 24 horas. Cocinar en agua hasta ablandar (aprox. 2 horas). Reservar con el caldo." },
        { paso: 2, titulo: "Preparar el dulce", descripcion: "Disolver la panela en 1 litro de agua caliente con canela, clavos y pimienta. Hervir 10 minutos y colar." },
        { paso: 3, titulo: "Integrar el lulo", descripcion: "Pelar y licuar los lulos con un poco de agua. Colar y agregar al caldo de maíz con el agua de panela especiada." },
        { paso: 4, titulo: "Aromatizar y enfriar", descripcion: "Añadir ralladura y jugo de naranja, hojas de naranjo. Cocinar 15 minutos a fuego bajo. Enfriar completamente." },
        { paso: 5, titulo: "Servir", descripcion: "Servir muy frío en vaso grande con granos de maíz cocido sumergidos. Opcional: agregar hielo triturado." }
      ],
      imagen: "assets/images/Champus.webp",
      imagenAlt: "Vasode champús caleño con maíz flotando, lulo y especias sobre fondo de madera",
      video: "https://www.youtube.com/embed/VQApYXvqhCY?si=jqbAXi0LHcuX40Fo",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Loma de la Cruz",
        direccion: "Av. 1N con Calle 58N, Cali",
        lat: 3.4601,
        lng: -76.5278,
        descripcion: "Zona bohemia donde los vendedores ambulantes ofrecen el mejor champús artesanal de Cali."
      },
      rating: 4.6,
      tiempoCoccion: "3 horas",
      dificultad: "Media",
      porciones: 10,
      destacado: false,
      tags: ["bebida", "ancestral", "refrescante", "maíz", "Semana Santa"]
    },
    {
      id: 4,
      nombre: "Jugo de Borojo",
      categoria: "Bebida",
      subcategoria: "Bebidas Refrescantes",
      descripcionCorta: "La bebida icónica de Cali: lulo machacado con azúcar y hielo, símbolo de la identidad caleña.",
      historia: "La Lulada es el orgullo líquido de Cali. A diferencia de los jugos convencionales, la lulada se prepara machacando el lulo (naranjilla) con azúcar y hielo, conservando la textura fibrosa de la fruta que es exclusiva de esta región. Surgió en los años 40 en las refresquerías del barrio San Antonio y la Sexta Avenida, convirtiéndose en la bebida preferida de los caleños para combatir el calor tropical. Es inimaginable una tarde en Cali sin una lulada en mano. En 2021, fue declarada Patrimonio Cultural Gastronómico de Cali.",
      ingredientes: [
        { grupo: "Principal", items: ["8 lulos maduros pero firmes", "4 cucharadas de azúcar (o al gusto)", "Hielo triturado en abundancia"] },
        { grupo: "Opcional", items: ["Agua (si se desea más líquida)", "Limón (unas gotas)"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Seleccionar el lulo", descripcion: "Usar lulos maduros de color naranja intenso, firmes. Lavarlos bien y pelarlos parcialmente (conservar algo de cáscara para el amargor)." },
        { paso: 2, titulo: "Machacar", descripcion: "Cortar el lulo en mitades. Con un mazo o mano de mortero, machacar en el vaso directamente con el azúcar hasta liberar el jugo y romper la pulpa." },
        { paso: 3, titulo: "Agregar hielo", descripcion: "Añadir abundante hielo triturado sobre el lulo machacado. Mezclar con cuchara larga para integrar." },
        { paso: 4, titulo: "Servir inmediatamente", descripcion: "Servir en vaso alto sin colar, con toda la pulpa y semillas. Insertar pitillo y decorar con rodaja de lulo. Consumir de inmediato." }
      ],
      imagen: "assets/images/Borojo.webp",
      imagenAlt: "Vaso de lulada caleña con hielo triturado y lulo naranja machacado",
      video: "https://www.youtube.com/embed/hsqwP4BOsCY?si=kzvRs7IfgAa2iDS_",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Avenida Sexta - Zona Rosa",
        direccion: "Avenida 6N #17-50, Cali",
        lat: 3.4567,
        lng: -76.5245,
        descripcion: "La Avenida Sexta es el epicentro de la lulada caleña, con decenas de locales especializados."
      },
      rating: 4.8,
      tiempoCoccion: "10 minutos",
      dificultad: "Fácil",
      porciones: 2,
      destacado: true,
      tags: ["bebida", "frutas", "refrescante", "patrimonio", "icónica"]
    },
    {
      id: 5,
      nombre: "Pandebono",
      categoria: "Panadería",
      subcategoria: "Pan de Maíz y Queso",
      descripcionCorta: "Pan de queso con almidón de yuca y maíz, crujiente por fuera y esponjoso por dentro. Un bocado de cielo vallecaucano.",
      historia: "El Pandebono tiene una historia tan rica como su sabor. Su nombre proviene de 'Pan de Bono', en honor a Señor Bono, un sacerdote jesuita de origen italiano que en el siglo XVIII enseñó a preparar pan en la hacienda El Paraíso, en el Cerrito, Valle del Cauca. La receta original fue adaptada con ingredientes locales: queso costeño, almidón de yuca agria y maíz cernido, creando una textura única imposible de replicar fuera de la región. Hoy es el desayuno preferido de los caleños, acompañado de chocolate caliente o café con leche.",
      ingredientes: [
        { grupo: "Masas", items: ["250g almidón de yuca agria", "100g maíz cernido (masa)", "200g queso costeño rallado", "1 cucharadita de sal"] },
        { grupo: "Líquidos", items: ["2 huevos", "50ml leche tibia", "1 cucharada de azúcar"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Mezclar ingredientes secos", descripcion: "Combinar el almidón de yuca, la masa de maíz, la sal y el azúcar. Mezclar bien con las manos." },
        { paso: 2, titulo: "Incorporar queso y huevos", descripcion: "Agregar el queso costeño rallado fino y los huevos. Amasar incorporando la leche tibia poco a poco hasta obtener masa homogénea y no pegajosa." },
        { paso: 3, titulo: "Formar las roscas", descripcion: "Tomar porciones de masa de 60g, formar bolitas y luego roscas. Colocar en bandeja con papel encerado." },
        { paso: 4, titulo: "Hornear", descripcion: "Hornear a 220°C por 15-18 minutos hasta que inflen y doren levemente. El interior debe quedar esponjoso." }
      ],
      imagen: "assets/images/Pandebono.webp",
      imagenAlt: "Pandebon os recién horneados en canasta de mimbre, dorados y esponjosos",
      video: "https://www.youtube.com/embed/N08XZAA5A0I?si=U-ISgzAiKEgyjSW5",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Panadería La Gran Colombia - Chipichape",
        direccion: "Calle 38N #6N-40, Cali",
        lat: 3.4710,
        lng: -76.5340,
        descripcion: "Una de las panaderías más antiguas de Cali, famosa por sus pandebonos artesanales desde 1958."
      },
      rating: 4.9,
      tiempoCoccion: "45 minutos",
      dificultad: "Media",
      porciones: 12,
      destacado: true,
      tags: ["panadería", "desayuno", "queso", "tradicional", "horneado"]
    },
    {
      id: 6,
      nombre: "Cholado",
      categoria: "Postre",
      subcategoria: "Postres Fríos",
      descripcionCorta: "Raspadillo de hielo con frutas tropicales, jarabes de colores y leche condensada. La fiesta del paladar.",
      historia: "El Cholado es uno de los postres más populares de Cali y el Valle del Cauca, especialmente en los municipios de Jamundí y Yumbo. Su origen humilde se remonta a los vendedores callejeros del siglo XX, que aprovechaban el hielo del río para crear este refrescante manjar. La palabra 'cholado' proviene del término 'cholo', que en el Valle del Cauca designa afectuosamente a las personas de origen mestizo e indígena. Con el tiempo, se fue enriqueciendo con frutas exóticas, jarabes de colores vivos y leche condensada, convirtiéndose en el postre más colorido y festivo de la región.",
      ingredientes: [
        { grupo: "Base", items: ["Hielo raspado (abundante)", "Leche condensada", "Crema de leche"] },
        { grupo: "Frutas", items: ["Mango en cubos", "Piña en trozos", "Mora entera", "Banano en rodajas", "Papaya en cubos", "Uvas"] },
        { grupo: "Jarabes", items: ["Jarabe de mora", "Jarabe de maracuyá", "Jarabe de tamarindo", "Jarabe de fresa"] },
        { grupo: "Toppings", items: ["Bocadillo (dulce de guayaba)", "Chantilly", "Bolas de helado"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Raspar el hielo", descripcion: "Usar máquina raspadora o rallador grueso para obtener hielo fino y esponjoso. Llenarlo en vaso o recipiente hondo." },
        { paso: 2, titulo: "Primera capa de fruta", descripcion: "Distribuir las frutas tropicales cortadas sobre el hielo formando capas coloridas. Comenzar con mango y piña." },
        { paso: 3, titulo: "Aplicar jarabes", descripcion: "Verter los jarabes de colores intercalados sobre las frutas. La clave está en la variedad de colores y sabores." },
        { paso: 4, titulo: "Leche condensada", descripcion: "Aplicar chorro generoso de leche condensada y crema de leche sobre toda la preparación." },
        { paso: 5, titulo: "Decorar y servir", descripcion: "Coronar con bocadillo, bola de helado, chantilly y más frutas. Servir inmediatamente antes que se derrita." }
      ],
      imagen: "assets/images/Cholado.webp",
      imagenAlt: "Cholado caleño con frutas tropicales coloridas, jarabes y hielo raspado",
      video: "hhttps://www.youtube.com/embed/pbg1zILOE3E?si=Ro70-F2kfz3V2AHV",
      audio: "assets/audios/audio1.mp3",
      ubicacion: {
        nombre: "Parque de San Fernando",
        direccion: "Carrera 34 #5-50, San Fernando, Cali",
        lat: 3.4356,
        lng: -76.5480,
        descripcion: "El parque de San Fernando alberga los vendedores de cholados más reconocidos de Cali."
      },
      rating: 4.7,
      tiempoCoccion: "15 minutos",
      dificultad: "Fácil",
      porciones: 1,
      destacado: false,
      tags: ["postre", "frío", "frutas", "callejero", "colorido"]
    },
    {
      id: 7,
      nombre: "Empanadas de Pipián",
      categoria: "Entrada",
      subcategoria: "Empanadas y Fritos",
      descripcionCorta: "Empanadas de maíz rellenas con papa en salsa de pipián, una receta indígena prehispánica que persiste en la memoria culinaria caleña.",
      historia: "Las Empanadas de Pipián son uno de los platos más ancestrales de Colombia. El pipián es una salsa espesa elaborada con maíz tostado y ají colorado que tiene raíces en las culturas precolombinas de los Andes. En Cali, esta receta fue adoptada y adaptada por las comunidades afrocaleñas e indígenas Páez que habitaron la región. Las empanadas se venden callejeras en las madrugadas, siendo el sustento favorito de los trasnochadores y trabajadores que inician su jornada antes del amanecer. Son el alimento del pueblo, del esfuerzo y de la resistencia cultural.",
      ingredientes: [
        { grupo: "Masa", items: ["500g maíz blanco cocido y molido", "Sal al gusto", "Agua tibia"] },
        { grupo: "Relleno de Pipián", items: ["500g papa pastusa cocida y picada", "100g maíz tostado molido", "3 ajíes colorados", "Sal, comino y achiote"] },
        { grupo: "Para freír", items: ["Aceite vegetal abundante"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Preparar la masa", descripcion: "Mezclar el maíz molido con sal y agua tibia hasta obtener masa maleable. Reposar 15 minutos cubierta." },
        { paso: 2, titulo: "Hacer el pipián", descripcion: "Tostar el maíz hasta dorar. Moler con ají colorado, sal y comino. Sofreír con achiote y mezclar con la papa cocida y picada." },
        { paso: 3, titulo: "Armar empanadas", descripcion: "Formar discos de masa de 10cm. Poner cucharada de pipián al centro. Cerrar en forma de media luna y presionar bordes con tenedor." },
        { paso: 4, titulo: "Freír", descripcion: "Freír en aceite profundo a 180°C hasta dorar uniformemente (3-4 minutos por lado). Escurrir en papel absorbente." },
        { paso: 5, titulo: "Servir con ají", descripcion: "Servir calientes con ají de maní o hogao. Espolvorear sal y acompañar con limonada de panela." }
      ],
      imagen: "assets/images/Pipian.webp",
      imagenAlt: "Empanadas de pipián doradas en cesta con ají y hogao al lado",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      audio: null,
      ubicacion: {
        nombre: "Terminal de Transportes",
        direccion: "Calle 30N #2AN-29, Cali",
        lat: 3.4290,
        lng: -76.5220,
        descripcion: "Los alrededores del terminal son famosos por las empanadas de pipián servidas desde la madrugada."
      },
      rating: 4.5,
      tiempoCoccion: "1 hora",
      dificultad: "Media",
      porciones: 20,
      destacado: false,
      tags: ["entrada", "frito", "maíz", "ancestral", "callejero"]
    },
    {
      id: 8,
      nombre: "Arroz Atollado de Pollo",
      categoria: "Plato Fuerte",
      subcategoria: "Arroces",
      descripcionCorta: "Arroz cremoso y caldoso con pollo, papa y verduras, el comfort food definitivo del Valle del Cauca.",
      historia: "El Arroz Atollado es el plato que define los domingos familiares en el Valle del Cauca. 'Atollado' proviene de 'atollarse', que significa quedar atascado, haciendo referencia a la textura cremosa y pegajosa de este arroz que se cocina con más agua de lo habitual. A diferencia de la paella española que pudo haberlo influenciado, el arroz atollado vallecaucano incorpora hogao, papa criolla y especias locales. Es el plato de la reunión, de la solidaridad, del vecindario que comparte una olla gigante en los patios de las casas coloniales.",
      ingredientes: [
        { grupo: "Proteína", items: ["1 pollo entero en presas", "150g costilla de cerdo"] },
        { grupo: "Arroz y Verduras", items: ["2 tazas arroz blanco", "300g papa criolla", "1 mazorca en rodajas", "2 zanahorias", "1 taza arveja"] },
        { grupo: "Hogao Base", items: ["4 tomates chonto", "2 cebollas largas", "Ajo, achiote, comino", "Cilantro al gusto"] }
      ],
      preparacion: [
        { paso: 1, titulo: "Cocinar las carnes", descripcion: "Dorar las presas de pollo y costilla en la olla con aceite caliente. Sazonar con ajo, sal y comino." },
        { paso: 2, titulo: "Preparar hogao", descripcion: "Retirar las carnes. En la misma olla, sofreír tomate y cebolla con achiote hasta obtener hogao espeso." },
        { paso: 3, titulo: "Incorporar arroz", descripcion: "Agregar el arroz al hogao y mezclar. Volver a poner las carnes y cubrir con 5 tazas de agua caliente." },
        { paso: 4, titulo: "Verduras y tubérculos", descripcion: "A los 15 minutos, incorporar papa criolla, zanahoria, mazorca y arveja. Revolver ocasionalmente." },
        { paso: 5, titulo: "Terminar cremoso", descripcion: "El arroz debe quedar caldoso ('atollado'). Ajustar sal, agregar cilantro picado y servir en plato hondo caliente." }
      ],
      imagen: "assets/images/ArrozAtollado.webp",
      imagenAlt: "Arroz atollado cremoso con pollo, papa criolla y verduras en olla de barro",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      audio: null,
      ubicacion: {
        nombre: "Barrio San Antonio",
        direccion: "Carrera 10 #3-50, San Antonio, Cali",
        lat: 3.4489,
        lng: -76.5401,
        descripcion: "El pintoresco barrio San Antonio tiene varias casas-restaurante que sirven arroz atollado tradicional."
      },
      rating: 4.6,
      tiempoCoccion: "1.5 horas",
      dificultad: "Media",
      porciones: 6,
      destacado: false,
      tags: ["arroz", "cremoso", "familiar", "domingo", "completo"]
    }
  ];

  // ── Usuarios simulados ────────────────────────────────────────────────────
  const _users = [
    {
      id: 1,
      nombre: "Admin Sabores",
      email: "admin@sabores.com",
      password: btoa("Admin2024!"),
      rol: "admin",
      avatar: "AS",
      favoritos: [1, 4, 5]
    },
    {
      id: 2,
      nombre: "María Fernanda",
      email: "mafe@cali.com",
      password: btoa("Usuario123"),
      rol: "user",
      avatar: "MF",
      favoritos: [1, 3]
    }
  ];

  // ── Categorías ─────────────────────────────────────────────────────────────
  const _categories = [
    { id: "todos", label: "TODOS", icon: "" },
    { id: "Plato Fuerte", label: "Platos Fuertes", icon: "fas fa-utensils" },
    { id: "Bebida", label: "Bebidas", icon: "fa-solid fa-martini-glass" },
    { id: "Postre", label: "Postres", icon: "fas fa-cheese" },
    { id: "Entrada", label: "Entradas", icon: "fa-solid fa-bowl-rice" },
    { id: "Panadería", label: "Panadería", icon: "fas fa-bread-slice" }
  ];

  // ── Multimedia ─────────────────────────────────────────────────────────────
  const _media = [
    {
      id: 1,
      tipo: "imagen",
      titulo: "Mercado de la Galería Alameda",
      descripcion: "El mercado más tradicional de Cali, corazón de la gastronomía local.",
      url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80",
      alt: "Mercado tradicional con frutas y verduras coloridas",
      dishId: 1
    },
    {
      id: 2,
      tipo: "imagen",
      titulo: "Ingredientes del Valle",
      descripcion: "Los productos frescos del Valle del Cauca: lulo, guanábana y frutas tropicales.",
      url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&q=80",
      alt: "Frutas tropicales del Valle del Cauca sobre mesa rústica",
      dishId: 4
    },
    {
      id: 3,
      tipo: "imagen",
      titulo: "Cocina Vallecaucana Tradicional",
      descripcion: "Las ollas de barro y fogones de leña que dan vida a la gastronomía ancestral.",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
      alt: "Cocina tradicional con utensilios de barro y madera",
      dishId: null
    },
    {
      id: 4,
      tipo: "imagen",
      titulo: "Pandebono Artesanal",
      descripcion: "El pandebono recién horneado, símbolo del desayuno caleño.",
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
      alt: "Pandebonos artesanales recién horneados en bandeja de madera",
      dishId: 5
    },
    {
      id: 5,
      tipo: "video",
      titulo: "Tradiciones Culinarias de Cali",
      descripcion: "Documental sobre las tradiciones gastronómicas de la ciudad de Cali.",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      alt: "Video documental sobre gastronomía caleña",
      dishId: null
    },
    {
      id: 6,
      tipo: "audio",
      titulo: "Testimonio: La Abuela y el Sancocho",
      descripcion: "Doña Carmen nos cuenta cómo aprendió a hacer el sancocho de su abuela.",
      url: null,
      alt: "Testimonio oral sobre la preparación del sancocho tradicional",
      dishId: 1
    }
  ];

  // ── Simulación de API (fetch simulado) ─────────────────────────────────────
  const _simulateDelay = (ms = 200) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const _deepClone = obj => JSON.parse(JSON.stringify(obj));

  // ── API Pública ───────────────────────────────────────────────────────────
  return {
    // Platos
    async getDishes() {
      await _simulateDelay();
      return _deepClone(_dishes);
    },

    async getDishById(id) {
      await _simulateDelay(100);
      const dish = _dishes.find(d => d.id === Number(id));
      return dish ? _deepClone(dish) : null;
    },

    async searchDishes(query, category = "todos") {
      await _simulateDelay(150);
      let result = _deepClone(_dishes);
      if (category !== "todos") {
        result = result.filter(d => d.categoria === category);
      }
      if (query && query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(d =>
          d.nombre.toLowerCase().includes(q) ||
          d.descripcionCorta.toLowerCase().includes(q) ||
          d.tags.some(t => t.includes(q))
        );
      }
      return result;
    },

    async createDish(data) {
      await _simulateDelay(300);
      const newId = Math.max(..._dishes.map(d => d.id)) + 1;
      const newDish = {
        ...data,
        id: newId,
        rating: 0,
        destacado: false,
        tags: data.tags || []
      };
      _dishes.push(newDish);
      return _deepClone(newDish);
    },

    async updateDish(id, data) {
      await _simulateDelay(250);
      const idx = _dishes.findIndex(d => d.id === Number(id));
      if (idx === -1) throw new Error("Plato no encontrado");
      _dishes[idx] = { ..._dishes[idx], ...data, id: Number(id) };
      return _deepClone(_dishes[idx]);
    },

    async deleteDish(id) {
      await _simulateDelay(200);
      const idx = _dishes.findIndex(d => d.id === Number(id));
      if (idx === -1) throw new Error("Plato no encontrado");
      _dishes.splice(idx, 1);
      return true;
    },

    // Usuarios
    async findUserByEmail(email) {
      await _simulateDelay(100);
      const user = _users.find(u => u.email === email);
      return user ? _deepClone(user) : null;
    },

    async createUser(data) {
      await _simulateDelay(300);
      const newId = Math.max(..._users.map(u => u.id)) + 1;
      const newUser = {
        id: newId,
        nombre: data.nombre,
        email: data.email,
        password: btoa(data.password),
        rol: "user",
        avatar: data.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
        favoritos: []
      };
      _users.push(newUser);
      const { password, ...safeUser } = newUser;
      return safeUser;
    },

    async updateUserFavorites(userId, favorites) {
      await _simulateDelay(100);
      const user = _users.find(u => u.id === userId);
      if (user) user.favoritos = favorites;
      return true;
    },

    // Categorías y Media
    getCategories() { return _deepClone(_categories); },
    async getMedia() { await _simulateDelay(150); return _deepClone(_media); },

    // Stats
    async getStats() {
      await _simulateDelay(100);
      return {
        totalDishes: _dishes.length,
        totalUsers: _users.length,
        totalMedia: _media.length,
        categories: _categories.length - 1,
        featured: _dishes.filter(d => d.destacado).length
      };
    }
  };
})();

// Exportar al scope global
window.DB = DB;