export const SAOCC_DATA = {
  stadium: {
    name: "MetLife Stadium, East Rutherford",
    capacity: 82500,
    sectors: [
      { id: "gate-a", name: "Gate A (North Entrance)", type: "gate", x: 150, y: 50, radius: 18, color: "#3b82f6" },
      { id: "gate-b", name: "Gate B (East Entrance)", type: "gate", x: 270, y: 130, radius: 18, color: "#3b82f6" },
      { id: "gate-c", name: "Gate C (Southeast Entrance)", type: "gate", x: 250, y: 270, radius: 18, color: "#3b82f6" },
      { id: "gate-d", name: "Gate D (South Entrance)", type: "gate", x: 150, y: 350, radius: 18, color: "#3b82f6" },
      { id: "gate-e", name: "Gate E (Southwest Entrance)", type: "gate", x: 50, y: 270, radius: 18, color: "#3b82f6" },
      { id: "gate-f", name: "Gate F (West Entrance)", type: "gate", x: 30, y: 130, radius: 18, color: "#3b82f6" },
      { id: "concession-1", name: "Concession Hub 1 (100 Level)", type: "concession", x: 90, y: 100, radius: 14, color: "#10b981" },
      { id: "concession-2", name: "Concession Hub 2 (200 Level)", type: "concession", x: 210, y: 90, radius: 14, color: "#10b981" },
      { id: "concession-3", name: "Concession Hub 3 (300 Level)", type: "concession", x: 210, y: 290, radius: 14, color: "#10b981" },
      { id: "concession-4", name: "Concession Hub 4 (100 Level)", type: "concession", x: 90, y: 290, radius: 14, color: "#10b981" },
      { id: "restroom-1", name: "Restroom Block North", type: "restroom", x: 150, y: 95, radius: 10, color: "#a855f7" },
      { id: "restroom-2", name: "Restroom Block East", type: "restroom", x: 235, y: 200, radius: 10, color: "#a855f7" },
      { id: "restroom-3", name: "Restroom Block South", type: "restroom", x: 150, y: 300, radius: 10, color: "#a855f7" },
      { id: "restroom-4", name: "Restroom Block West", type: "restroom", x: 65, y: 200, radius: 10, color: "#a855f7" }
    ],
    pathways: {
      "gate-a": [150, 95],
      "gate-b": [235, 200],
      "gate-c": [235, 200],
      "gate-d": [150, 300],
      "gate-e": [65, 200],
      "gate-f": [65, 200]
    }
  },

  volunteers: [
    { id: "v1", name: "Diego Garcia", role: "Crowd Control", status: "Available", zone: "Gate A", phone: "+1 (555) 019-2831", languages: ["EN", "ES"] },
    { id: "v2", name: "Yuki Sato", role: "Technical Support", status: "Available", zone: "Gate F", phone: "+1 (555) 019-4820", languages: ["EN", "JA"] },
    { id: "v3", name: "Aisha Diallo", role: "Medical Aid", status: "Available", zone: "Concession Hub 1", phone: "+1 (555) 019-3918", languages: ["EN", "FR", "WO"] },
    { id: "v4", name: "Mateo Silva", role: "Info Desk & Guide", status: "Available", zone: "Restroom Block East", phone: "+1 (555) 019-8752", languages: ["PT", "ES", "EN"] },
    { id: "v5", name: "Chloe Dupont", role: "Crowd Control", status: "Available", zone: "Gate D", phone: "+1 (555) 019-1234", languages: ["FR", "EN"] },
    { id: "v6", name: "Tariq Mansoor", role: "Medical Aid", status: "Available", zone: "Concession Hub 3", phone: "+1 (555) 019-5566", languages: ["AR", "EN"] }
  ],

  incidentProtocols: {
    spill: {
      category: "Maintenance",
      title: "Liquid Spill Alert",
      defaultSeverity: "Medium",
      actionInstructions: "1. Dispatch cleaning crew with wet-floor warning signs.\n2. Rope off the immediate zone if it is a high-traffic passage.\n3. Verify cleanup is complete within 10 minutes to prevent slip-and-fall incidents.",
      volunteerRole: "Crowd Control"
    },
    medical: {
      category: "Medical",
      title: "Minor Medical Assistance",
      defaultSeverity: "High",
      actionInstructions: "1. Alert nearby Medical Volunteer and direct them to the coordinates.\n2. Instruct staff to keep bystanders back to maintain privacy.\n3. Prepare a wheelchair dispatch if transport to the First Aid Station is required.",
      volunteerRole: "Medical Aid"
    },
    congestion: {
      category: "Crowd Control",
      title: "High Crowd Density Delay",
      defaultSeverity: "Medium",
      actionInstructions: "1. Deploy Crowd Control volunteers to initiate flow-diversion protocols.\n2. Update digital stadium displays to guide fans toward alternative paths.\n3. Open backup ticket scanning turnstiles.",
      volunteerRole: "Crowd Control"
    },
    technical: {
      category: "Technical",
      title: "POS / Scanner Offline",
      defaultSeverity: "Medium",
      actionInstructions: "1. Dispatch technical volunteer to verify network connectivity.\n2. Set up offline paper/token backup systems if hardware restart takes > 5 mins.\n3. Display apology signs regarding processing delays.",
      volunteerRole: "Technical Support"
    },
    sustainability_overflow: {
      category: "Sustainability",
      title: "Waste Bin Overflow",
      defaultSeverity: "Low",
      actionInstructions: "1. Contact janitorial dispatch to empty the bins immediately.\n2. Swap bin bags and double-check compost sorting compliance.\n3. Remind adjacent concessions to monitor sorting lanes.",
      volunteerRole: "Info Desk & Guide"
    }
  },

  scenarios: {
    standard: {
      name: "Normal Operations",
      weather: "Sunny, 75°F (24°C)",
      transit: "NJ Transit Trains running on schedule. Express buses loading.",
      alert: "All systems operating within nominal parameters. Clear skies."
    },
    storm: {
      name: "Severe Weather Delay",
      weather: "Heavy Thunderstorm & Lightning warning",
      transit: "Rail systems operating with 15-minute speed restrictions. Shuttle queues covered.",
      alert: "Lightning detected within 8 miles. Recommended to HOLD fans inside stadium concourses. AI suggests delayed stadium clearing protocol."
    },
    transit_delay: {
      name: "Secaucus Rail Line Disruption",
      weather: "Clear, 80°F (27°C)",
      transit: "NJ Transit Meadowlands Line temporarily halted due to track signal failure.",
      alert: "Severe exit bottlenecks expected. AI recommends activating emergency bus shuttles from Lot G and displaying transit detour info on stadium screens."
    },
    heatwave: {
      name: "Extreme Heat advisory",
      weather: "Scorching, 98°F (37°C)",
      transit: "Regular transit loading schedules. Direct hydration carts activated.",
      alert: "High heat index. Volunteer teams dispatched with emergency water bottles. Cool zones activated at Concession Hubs 1 and 3."
    }
  },

  translations: {
    en: {
      title: "FIFA 2026 Smart Arena Portal",
      tagline: "Your Personal AI Matchday Companion",
      chatPlaceholder: "Ask about seats, food, transport, or recycling...",
      langSelect: "Select Language",
      seatFinder: "Find My Seat & Wayfinding Guide",
      secLabel: "Section",
      rowLabel: "Row",
      seatLabel: "Seat",
      btnFind: "Guide Me to My Seat",
      facilities: "Facility Wait Times",
      ecoPoints: "Eco-Champion Points",
      sustainability: "Eco Sustainability Assistant",
      scanLabel: "Report Waste Type",
      ecoPointsShort: "Pts",
      suggestedQuestions: [
        "How do I walk to Section 102 from Gate A?",
        "Where is the nearest wheelchair accessible restroom?",
        "What is the transit schedule to Manhattan after the match?",
        "Is there a recycling station near Concession Hub 2?",
        "Which gate has the shortest queue time right now?"
      ],
      responses: {
        welcome: "Hello! I am your GenAI Matchday Assistant. How can I help you enjoy your World Cup 2026 experience today?",
        default: "That is a great question! I recommend checking in with the nearest volunteer or looking at the main visual guides around your current sector. Let me know if you need specific step-by-step directions to your seat!",
        seatRoute: (gate, sec, row, seat) => `To reach Section ${sec}, Row ${row}, Seat ${seat}: We recommend entering through **${gate}**. Walk straight to the outer concourse, turn left, and proceed past Concession Hub 1. Follow the overhead signs for Section ${sec}. A volunteer in that zone is ready to assist you!`,
        accessibility: "All levels of the stadium are equipped with ADA-compliant restrooms. The nearest wheelchair-accessible restroom is located next to Restroom Block West (near Gate F) and Concession Hub 1. Elevators are situated adjacent to Gates A and D.",
        transit: "The NJ Transit Meadowlands Rail Line runs trains directly to Secaucus Junction every 10-15 minutes after the game. Express buses to Manhattan Port Authority depart from Lot G starting 2 hours before kickoff and up to 1 hour post-match. Taxis and Rideshares are designated in Lot E.",
        sustainability: (type) => {
          const disposal = {
            plastic: "Please dispose of plastic bottles in the **BLUE RECYCLING BINS** located at every concession exit. Doing so helps us meet our net-zero carbon goals!",
            can: "Aluminum cans are 100% recyclable! Place them in the **BLUE RECYCLING BINS**. Thanks for keeping our stadium clean!",
            food: "Food scraps should go in the **COMPOST BINS (GREEN)**. Empty paper cups or containers contaminated with food go into General Waste.",
            paper: "Clean paper wrappers, cardboard, and programs go in the **PAPER RECYCLING BINS (BLUE)**. Thank you!",
            general: "This goes into the **BLACK LANDFILL BINS**. Please recycle items whenever possible!"
          };
          return disposal[type] || "Please place waste in the appropriate bins. Blue for recyclables (plastics, metals), Green for compost, Black for landfill.";
        }
      }
    },
    es: {
      title: "Portal de la Arena Inteligente FIFA 2026",
      tagline: "Tu Compañero de IA para el Día del Partido",
      chatPlaceholder: "Pregunta sobre asientos, comida, transporte o reciclaje...",
      langSelect: "Seleccionar Idioma",
      seatFinder: "Buscar mi Asiento y Guía de Ruta",
      secLabel: "Sección",
      rowLabel: "Fila",
      seatLabel: "Asiento",
      btnFind: "Guíame a mi Asiento",
      facilities: "Tiempos de Espera",
      ecoPoints: "Puntos Eco-Campeón",
      sustainability: "Asistente de Sostenibilidad Eco",
      scanLabel: "Reportar Tipo de Residuo",
      ecoPointsShort: "Pts",
      suggestedQuestions: [
        "¿Cómo camino a la Sección 102 desde la Puerta A?",
        "¿Dónde está el baño accesible para sillas de ruedas más cercano?",
        "¿Cuál es el horario de transporte a Manhattan después del partido?",
        "¿Hay una estación de reciclaje cerca de la Concesión Hub 2?",
        "¿Qué puerta tiene el tiempo de espera más corto ahora mismo?"
      ],
      responses: {
        welcome: "¡Hola! Soy tu Asistente GenAI para el día del partido. ¿Cómo puedo ayudarte a disfrutar de tu experiencia en la Copa Mundial 2026 hoy?",
        default: "¡Excelente pregunta! Recomiendo consultar con el voluntario más cercano o mirar las guías visuales principales alrededor de tu sector actual. ¡Avísame si necesitas indicaciones paso a paso para tu asiento!",
        seatRoute: (gate, sec, row, seat) => `Para llegar a la Sección ${sec}, Fila ${row}, Asiento ${seat}: Recomendamos entrar por la **${gate}**. Camine recto hacia el pasillo exterior, gire a la izquierda y pase por el Concession Hub 1. Siga los carteles superiores para la Sección ${sec}. ¡Un voluntario en esa zona está listo para ayudarle!`,
        accessibility: "Todos los niveles del estadio están equipados con baños que cumplen con la normativa ADA. El baño accesible para sillas de ruedas más cercano está al lado del Bloque de Baños Oeste (cerca de la Puerta F) y el Concession Hub 1. Los ascensores están junto a las Puertas A y D.",
        transit: "La línea Meadowlands Rail Line de NJ Transit ofrece trenes directos a Secaucus Junction cada 10-15 minutos después del partido. Los autobuses expresos a Manhattan Port Authority salen del Lote G a partir de 2 horas antes y hasta 1 hora después. Los taxis y viajes compartidos están en el Lote E.",
        sustainability: (type) => {
          const disposal = {
            plastic: "Deseche las botellas de plástico en los **CONTENEDORES AZULES DE RECICLAJE** ubicados en cada salida de concesión. ¡Ayúdenos a lograr nuestra meta de carbono neto cero!",
            can: "¡Las latas de aluminio son 100% reciclables! Colóquelas en los **CONTENEDORES AZULES**. ¡Gracias por mantener limpio el estadio!",
            food: "Los restos de comida deben ir a los **CONTENEDORES DE COMPOST (VERDES)**. Los vasos de papel vacíos o recipientes con restos de comida van a Residuos Generales.",
            paper: "Los envoltorios de papel limpio, cartón y programas van en los **CONTENEDORES AZULES**. ¡Gracias!",
            general: "Esto va a los **CONTENEDORES NEGROS DE BASURA GENERAL**. ¡Recicle siempre que sea posible!"
          };
          return disposal[type] || "Coloque los residuos en los contenedores adecuados. Azul para reciclables, Verde para compost, Negro para basura general.";
        }
      }
    },
    fr: {
      title: "Portail de l'Arène Intelligente FIFA 2026",
      tagline: "Votre Compagnon IA pour le Jour du Match",
      chatPlaceholder: "Posez des questions sur les sièges, la nourriture, les transports...",
      langSelect: "Choisir la Langue",
      seatFinder: "Trouver Mon Siège & Guidage",
      secLabel: "Section",
      rowLabel: "Rangée",
      seatLabel: "Siège",
      btnFind: "Guidez-moi à mon Siège",
      facilities: "Temps d'Attente",
      ecoPoints: "Points Éco-Champion",
      sustainability: "Assistant Éco-Soutenabilité",
      scanLabel: "Signaler le Type de Déchet",
      ecoPointsShort: "Pts",
      suggestedQuestions: [
        "Comment aller à la Section 102 depuis la Porte A ?",
        "Où se trouve le toilette accessible en fauteuil roulant le plus proche ?",
        "Quel est l'horaire de transport vers Manhattan après le match ?",
        "Y a-t-il une station de recyclage près du Concession Hub 2 ?",
        "Quelle porte a le temps d'attente le plus court en ce moment ?"
      ],
      responses: {
        welcome: "Bonjour ! Je suis votre assistant de match GenAI. Comment puis-je vous aider à profiter de votre Coupe du Monde 2026 aujourd'hui ?",
        default: "C'est une excellente question ! Je vous conseille de vous adresser au bénévole le plus proche ou de regarder les panneaux d'orientation principaux. Dites-moi si vous avez besoin d'un itinéraire précis pour votre siège.",
        seatRoute: (gate, sec, row, seat) => `Pour atteindre la Section ${sec}, Rangée ${row}, Siège ${seat} : Nous vous conseillons d'entrer par la **${gate}**. Marchez tout droit vers le hall extérieur, tournez à gauche et passez devant le Concession Hub 1. Suivez les panneaux pour la Section ${sec}. Un bénévole dans cette zone est prêt à vous guider !`,
        accessibility: "Tous les niveaux du stade sont équipés de toilettes conformes aux normes d'accessibilité (ADA). Les toilettes accessibles les plus proches se situent à côté du bloc sanitaire Ouest (près de la Porte F) et du Concession Hub 1. Des ascenseurs sont situés près des Portes A et D.",
        transit: "La ligne ferroviaire Meadowlands Rail Line de NJ Transit dessert directement Secaucus Junction toutes les 10 à 15 minutes après le match. Des bus express pour Manhattan partent du parking G. Taxis et VTC sont situés dans le parking E.",
        sustainability: (type) => {
          const disposal = {
            plastic: "Veuillez jeter les bouteilles en plastique dans les **BACS DE RECYCLAGE BLEUS** à la sortie des concessions. Aidez-nous à atteindre nos objectifs de neutralité carbone !",
            can: "Les canettes en aluminium sont 100% recyclables ! Placez-les dans les **BACS BLEUS**. Merci de garder notre stade propre !",
            food: "Les restes alimentaires doivent aller dans les **BACS À COMPOST (VERTS)**. Les gobelets en carton usagés vont dans les déchets résiduels.",
            paper: "Le papier propre, le carton et les programmes vont dans les **BACS DE RECYCLAGE BLEUS**. Merci !",
            general: "Cela va dans les **BACS NOIRS (DÉCHETS MÉNAGERS)**. Veuillez recycler dès que possible !"
          };
          return disposal[type] || "Veuillez trier vos déchets dans les bacs appropriés. Bleu pour le recyclage, Vert pour le compost, Noir pour le tout-venant.";
        }
      }
    },
    ar: {
      title: "بوابة ملعب فيفا 2026 الذكي",
      tagline: "مساعدك الشخصي المدعوم بالذكاء الاصطناعي",
      chatPlaceholder: "اسأل عن المقاعد، الطعام، المواصلات، أو إعادة التدوير...",
      langSelect: "اختر اللغة",
      seatFinder: "ابحث عن مقعدي ودليل الطريق",
      secLabel: "القسم",
      rowLabel: "الصف",
      seatLabel: "المقعد",
      btnFind: "أرشدني إلى مقعدي",
      facilities: "أوقات الانتظار",
      ecoPoints: "نقاط البطل البيئي",
      sustainability: "مساعد الاستدامة البيئية",
      scanLabel: "الإبلاغ عن نوع النفايات",
      ecoPointsShort: "نقطة",
      suggestedQuestions: [
        "كيف أمشي إلى القسم 102 من البوابة أ؟",
        "أين أجد أقرب دورة مياه مجهزة للكراسي المتحركة؟",
        "ما هو جدول النقل إلى مانهاتن بعد المباراة؟",
        "هل توجد محطة إعادة تدوير بالقرب من مركز الطعام 2؟",
        "أي البوابات لديها أقصر وقت انتظار حالياً؟"
      ],
      responses: {
        welcome: "مرحباً بك! أنا مساعد المباراة الذكي (GenAI). كيف يمكنني مساعدتك في الاستمتاع بتجربتك في كأس العالم 2026 اليوم؟",
        default: "سؤال رائع! أنصحك بالاستفسار من أقرب متطوع أو مراجعة اللوحات الإرشادية الرئيسية حول موقعك الحالي. أعلمني إذا كنت بحاجة إلى إرشادات تفصيلية للوصول إلى مقعدك!",
        seatRoute: (gate, sec, row, seat) => `للوصول إلى القسم ${sec}، الصف ${row}، المقعد ${seat}: ننصح بالدخول عبر **${gate}**. سر بشكل مباشر نحو الممر الخارجي، ثم انعطف يساراً وتابع السير متجاوزاً مركز الطعام 1. اتبع اللوحات المعلقة للوصول إلى القسم ${sec}. يوجد متطوع في تلك المنطقة مستعد لمساعدتك!`,
        accessibility: "جميع مستويات الملعب مجهزة بدورات مياه مطابقة لمواصفات ذوي الاحتياجات الخاصة. تقع أقرب دورة مياه مجهزة بجوار كتلة دورات المياه الغربية (بالقرب من البوابة ف) ومركز الطعام 1. تتوفر المصاعد بجانب البوابتين أ و د.",
        transit: "تعمل قطارات NJ Transit Meadowlands مباشرة إلى محطة Secaucus Junction كل 10-15 دقيقة بعد المباراة. تنطلق حافلات سريعة إلى مانهاتن من مواقف السيارات G قبل المباراة بساعتين وحتى ساعة واحدة بعد انتهائها. تتوفر سيارات الأجرة وسيارات التوصيل المشترك في موقف السيارات E.",
        sustainability: (type) => {
          const disposal = {
            plastic: "يرجى التخلص من الزجاجات البلاستيكية في **حاويات إعادة التدوير الزرقاء** عند مخارج مراكز الطعام. مساعدتك تساهم في تحقيق هدفنا لصفر انبعاثات كربونية!",
            can: "علب الألمنيوم قابلة لإعادة التدوير بنسبة 100%! يرجى وضعها في **حاويات إعادة التدوير الزرقاء**. شكراً للحفاظ على نظافة الملعب!",
            food: "يجب وضع بقايا الطعام في **حاويات السماد العضوي (الخضراء)**. تذهب الأكواب الورقية المستعملة الملوثة بالطعام إلى النفايات العامة.",
            paper: "الورق النظيف والكرتون يوضعان في **حاويات إعادة التدوير الزرقاء**. شكراً لك!",
            general: "يذهب هذا إلى **الحاويات السوداء للنفايات العامة**. يرجى إعادة التدوير كلما أمكن ذلك!"
          };
          return disposal[type] || "يرجى وضع النفايات في الحاويات المخصصة لها: الزرقاء للمواد القابلة لإعادة التدوير، الخضراء للسماد، والسوداء للنفايات العامة.";
        }
      }
    },
    pt: {
      title: "Portal da Arena Inteligente FIFA 2026",
      tagline: "Seu Companheiro de IA para o Dia do Jogo",
      chatPlaceholder: "Pergunte sobre assentos, comida, transporte ou reciclagem...",
      langSelect: "Selecionar Idioma",
      seatFinder: "Buscar meu Assento e Guia",
      secLabel: "Seção",
      rowLabel: "Fileira",
      seatLabel: "Assento",
      btnFind: "Guiar-me ao meu Assento",
      facilities: "Tempos de Espera",
      ecoPoints: "Pontos Eco-Campeão",
      sustainability: "Assistente de Sustentabilidade Eco",
      scanLabel: "Reportar Tipo de Resíduo",
      ecoPointsShort: "Pts",
      suggestedQuestions: [
        "Como eu ando até a Seção 102 a partir do Portão A?",
        "Onde fica o banheiro acessível para cadeirantes mais próximo?",
        "Qual é o horário de transporte para Manhattan após o jogo?",
        "Existe uma estação de reciclagem perto do Centro de Alimentação 2?",
        "Qual portão tem a fila mais rápida agora?"
      ],
      responses: {
        welcome: "Olá! Sou o seu Assistente GenAI do Dia do Jogo. Como posso ajudar você a aproveitar a sua experiência na Copa do Mundo FIFA 2026 hoje?",
        default: "Ótima pergunta! Recomendo consultar o voluntário mais próximo ou verificar os guias visuais principais ao redor do seu setor atual. Avise-me se precisar de direções passo a passo para o seu assento!",
        seatRoute: (gate, sec, row, seat) => `Para chegar à Seção ${sec}, Fileira ${row}, Assento ${seat}: Recomendamos entrar pelo **${gate}**. Caminhe direto para o corredor externo, vire à esquerda e passe pelo Concession Hub 1. Siga as placas suspensas para a Seção ${sec}. Um voluntário naquela zona estará pronto para ajudá-lo!`,
        accessibility: "Todos os níveis do estádio possuem banheiros acessíveis (ADA). O banheiro acessível para cadeirantes mais próximo fica ao lado do Bloco de Banheiros Oeste (próximo ao Portão F) e do Concession Hub 1. Os elevadores ficam ao lado dos Portões A e D.",
        transit: "Os trens da linha Meadowlands Rail Line da NJ Transit partem direto para Secaucus Junction a cada 10-15 minutos após o jogo. Ônibus expressos para Manhattan Port Authority partem do Estacionamento G a partir de 2 horas antes e até 1 hora depois. Taxis e aplicativos ficam no Estacionamento E.",
        sustainability: (type) => {
          const disposal = {
            plastic: "Descarte as garrafas plásticas nas **LIXEIRAS AZUIS DE RECICLAGEM** localizadas na saída de cada quiosque. Ajude-nos a atingir as metas de carbono zero!",
            can: "Latas de alumínio são 100% recicláveis! Coloque-as nas **LIXEIRAS AZUIS**. Obrigado por manter o estádio limpo!",
            food: "Restos de comida devem ser jogados nas **LIXEIRAS DE COMPOSTAGEM (VERDES)**. Copos de papel sujos ou embalagens com resíduos de comida vão no lixo comum.",
            paper: "Papel limpo, papelão e folhetos informativos vão nas **LIXEIRAS AZUIS**. Obrigado!",
            general: "Isso vai para as **LIXEIRAS PRETAS DE LIXO COMUM**. Recicle sempre que possível!"
          };
          return disposal[type] || "Coloque os resíduos nas lixeiras corretas. Azul para recicláveis, Verde para compostagem, Preto para lixo geral.";
        }
      }
    },
    hi: {
      title: "फीफा 2026 स्मार्ट एरिना पोर्टल",
      tagline: "आपका निजी एआई मैचडे साथी",
      chatPlaceholder: "सीटों, भोजन, परिवहन या रीसाइक्लिंग के बारे में पूछें...",
      langSelect: "भाषा चुनें",
      seatFinder: "मेरी सीट ढूंढें और मार्गदर्शिका",
      secLabel: "अनुभाग",
      rowLabel: "पंक्ति",
      seatLabel: "सीट",
      btnFind: "मुझे मेरी सीट तक निर्देशित करें",
      facilities: "सुविधा प्रतीक्षा समय",
      ecoPoints: "इको-चैंपियन अंक",
      sustainability: "इको सस्टेनेबिलिटी सहायक",
      scanLabel: "कचरे के प्रकार की रिपोर्ट करें",
      ecoPointsShort: "अंक",
      suggestedQuestions: [
        "गेट ए से सेक्शन 102 तक कैसे चलें?",
        "निकटतम व्हीलचेयर सुलभ शौचालय कहाँ है?",
        "मैच के बाद मैनहट्टन के लिए पारगमन कार्यक्रम क्या है?",
        "क्या कंसेशन हब 2 के पास रीसाइक्लिंग स्टेशन है?",
        "अभी किस गेट पर सबसे कम प्रतीक्षा समय है?"
      ],
      responses: {
        welcome: "नमस्ते! मैं आपका जेन एआई मैचडे सहायक हूँ। आज फीफा विश्व कप 2026 के आपके अनुभव को बेहतर बनाने में मैं आपकी क्या मदद कर सकता हूँ?",
        default: "यह एक बहुत अच्छा सवाल है! मैं निकटतम स्वयंसेवक से संपर्क करने या अपने वर्तमान क्षेत्र के मुख्य दृश्य दिशा-निर्देशों को देखने की सलाह देता हूँ। यदि आपको अपनी सीट के लिए चरण-दर-चरण निर्देश चाहिए तो मुझे बताएं!",
        seatRoute: (gate, sec, row, seat) => `अनुभाग ${sec}, पंक्ति ${row}, सीट ${seat} तक पहुँचने के लिए: हम **${gate}** के माध्यम से प्रवेश करने की सलाह देते हैं। सीधे बाहरी कॉनकोर्स में चलें, बाएं मुड़ें और कंसेशन हब 1 से आगे बढ़ें। अनुभाग ${sec} के लिए ओवरहेड संकेतों का पालन करें। उस क्षेत्र में एक स्वयंसेवक आपकी सहायता के लिए तैयार है!`,
        accessibility: "स्टेडियम के सभी स्तर एडीए-अनुरूप शौचालयों से सुसज्जित हैं। निकटतम व्हीलचेयर-सुलभ शौचालय वेस्ट टॉयलेट ब्लॉक (गेट एफ के पास) और कंसेशन हब 1 के बगल में स्थित है। लिफ्ट गेट ए और डी के पास स्थित हैं।",
        transit: "एनजे ट्रांजिट मेडलैंड्स रेल लाइन खेल के बाद हर 10-15 मिनट में सीधे सेकौकस जंक्शन के लिए ट्रेनें चलाती है। मैनहट्टन पोर्ट अथॉरिटी के लिए एक्सप्रेस बसें किकऑफ़ से 2 घंटे पहले और मैच के 1 घंटे बाद तक लॉट जी से प्रस्थान करती हैं। टैक्सी और राइडशेयर लॉट ई में निर्दिष्ट हैं।",
        sustainability: (type) => {
          const disposal = {
            plastic: "कृपया हर कंसेशन निकास पर स्थित **नीले रीसाइक्लिंग डिब्बे** में प्लास्टिक की बोतलें फेंकें। ऐसा करने से हमें हमारे शुद्ध-शून्य कार्बन लक्ष्यों को प्राप्त करने में मदद मिलती है!",
            can: "एल्युमिनियम कैन 100% रीसायकल करने योग्य हैं! उन्हें **नीले रीसाइक्लिंग डिब्बे** में रखें। स्टेडियम को साफ रखने के लिए धन्यवाद!",
            food: "भोजन के बचे हुए हिस्से को **कम्पोस्ट डिब्बे (हरे)** में जाना चाहिए। भोजन से दूषित खाली कागज के कप या कंटेनर सामान्य कचरे में जाते हैं।",
            paper: "साफ कागज के रैपर, कार्डबोर्ड और ब्रोशर **नीले पेपर रीसाइक्लिंग डिब्बे** में जाते हैं। धन्यवाद!",
            general: "यह **काले लैंडफिल डिब्बे** में जाता है। कृपया जब भी संभव हो वस्तुओं को रीसायकल करें!"
          };
          return disposal[type] || "कृपया कचरे को उचित डिब्बे में रखें। रीसाइक्लिंग के लिए नीला, कम्पोस्ट के लिए हरा, लैंडफिल के लिए काला।";
        }
      }
    },
    ta: {
      title: "ஃபிஃபா 2026 ஸ்மார்ட் அரங்கம் போர்டல்",
      tagline: "உங்கள் தனிப்பட்ட AI மேட்ச்டே துணை",
      chatPlaceholder: "இருக்கைகள், உணவு, போக்குவரத்து அல்லது மறுசுழற்சி பற்றி கேளுங்கள்...",
      langSelect: "மொழியைத் தேர்ந்தெடுக்கவும்",
      seatFinder: "எனது இருக்கையைக் கண்டுபிடி & வழிகாட்டி",
      secLabel: "பிரிவு",
      rowLabel: "வரிசை",
      seatLabel: "இருக்கை",
      btnFind: "எனது இருக்கைக்கு வழிகாட்டுங்கள்",
      facilities: "வசதிகள் காத்திருப்பு நேரம்",
      ecoPoints: "ஈகோ-சாம்பியன் புள்ளிகள்",
      sustainability: "சுற்றுச்சூழல் நிலைத்தன்மை உதவியாளர்",
      scanLabel: "கழிவு வகையைப் புகாரளிக்கவும்",
      ecoPointsShort: "புள்ளிகள்",
      suggestedQuestions: [
        "கேட் ஏ-யிலிருந்து பிரிவு 102-க்கு எப்படி செல்வது?",
        "அருகிலுள்ள சக்கர நாற்காலி அணுகக்கூடிய கழிப்பறை எங்கே உள்ளது?",
        "போட்டிக்கு பின் மன்ஹாட்டனுக்கான போக்குவரத்து அட்டவணை என்ன?",
        "உணவு ஹப் 2 அருகில் மறுசுழற்சி நிலையம் உள்ளதா?",
        "இப்போது எந்த கேட்டில் காத்திருப்பு நேரம் குறைவாக உள்ளது?"
      ],
      responses: {
        welcome: "வணக்கம்! நான் உங்கள் ஜென் ஏஐ மேட்ச்டே உதவியாளர். இன்று ஃபிஃபா உலகக் கோப்பை 2026 அனுபவத்தை அனுபவிக்க நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        default: "அது ஒரு சிறந்த கேள்வி! அருகிலுள்ள தன்னார்வலரை அணுக அல்லது உங்கள் தற்போதைய பிரிவைச் சுற்றியுள்ள முக்கிய காட்சி வழிகாட்டிகளைப் பார்க்க பரிந்துரைக்கிறேன். உங்கள் இருக்கைக்கான விரிவான வழிமுறைகள் தேவைப்பட்டால் எனக்குத் தெரியப்படுத்துங்கள்!",
        seatRoute: (gate, sec, row, seat) => `பிரிவு ${sec}, வரிசை ${row}, இருக்கை ${seat}-ஐ அடைய: நாம் **${gate}** வழியாக நுழைய பரிந்துரைக்கிறோம். நேராக வெளிப்புற कॉनकोर्स-க்குள் நடந்து, இடதுபுறம் திரும்பி, உணவு ஹப் 1-ஐ கடந்து செல்லவும். பிரிவு ${sec}-க்கான மேல்நிலை பலகைகளைப் பின்தொடரவும். உங்களுக்கு உதவ அந்த மண்டபத்தில் ஒரு தன்னார்வலர் தயாராக உள்ளார்!`,
        accessibility: "அரங்கத்தின் அனைத்து நிலைகளிலும் மாற்றுத்திறனாளிகளுக்கான கழிப்பறைகள் உள்ளன. அருகிலுள்ள சக்கர நாற்காலி அணுகக்கூடிய கழிப்பறை மேற்கு கழிப்பறை தொகுதி (கேட் எஃப் அருகில்) மற்றும் உணவு ஹப் 1-க்கு அருகில் உள்ளது. லிஃப்ட்கள் கேட் ஏ மற்றும் டி அருகில் உள்ளன.",
        transit: "என்ஜே டிரான்சிட் மெடோலாண்ட்ஸ் ரயில் பாதை போட்டிக்குப் பிறகு ஒவ்வொரு 10-15 நிமிடங்களுக்கும் நேரடியாக செகாகஸ் சந்திப்பிற்கு ரயில்களை இயக்குகிறது. மன்ஹாட்டனுக்கான எக்ஸ்பிரஸ் பேருந்துகள் போட்டித் தொடங்குவதற்கு 2 மணி நேரத்திற்கு முன்பும், போட்டி முடிந்து 1 மணி நேரம் வரையிலும் லாட் ஜி-யிலிருந்து புறப்படும். டாக்சிகள் மற்றும் ரைட்ஷேர்கள் லாட் இ-யில் ஒதுக்கப்பட்டுள்ளன.",
        sustainability: (type) => {
          const disposal = {
            plastic: "தயவுசெய்து பிளாஸ்டிக் பாட்டில்களை ஒவ்வொரு உணவு விற்பனை நிலையத்திலும் உள்ள **நீல நிற மறுசுழற்சி தொட்டியில்** போடவும். இது எங்கள் நிகர-பூஜ்ஜிய கார்பன் இலக்குகளை அடைய உதவுகிறது!",
            can: "அலுமினியம் கேன்கள் 100% மறுசுழற்சி செய்யக்கூடியவை! அவற்றை **நீல நிற மறுசுழற்சி தொட்டியில்** போடவும். அரங்கை சுத்தமாக வைத்திருப்பதற்கு நன்றி!",
            food: "உணவுக் கழிவுகள் **பசுமை மக்கும் குப்பைத் தொட்டியில் (பச்சை)** போடப்பட வேண்டும். உணவுக் கறை படிந்த வெற்று காகிதக் கோப்பைகள் பொதுக் கழிவுகளுக்குச் செல்கின்றன.",
            paper: "சுத்தமான காகித உறைகள், அட்டைப் பெட்டிகள் மற்றும் துண்டுப் பிரசுரங்கள் **நீல நிற காகித மறுசுழற்சி தொட்டியில்** செல்கின்றன. நன்றி!",
            general: "இது **கருப்பு நிற பொதுக் குப்பைத் தொட்டியில்** செல்கிறது. முடிந்தவரை பொருட்களை மறுசுழற்சி செய்யுங்கள்!"
          };
          return disposal[type] || "தயவுசெய்து கழிவுகளை பொருத்தமான தொட்டிகளில் போடவும். மறுசுழற்சிக்கு நீலம், உரம் தயாரிக்க பச்சை, பொதுக் கழிவுக்கு கருப்பு.";
        }
      }
    }
  }
};
