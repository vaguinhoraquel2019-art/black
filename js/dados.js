/* Índice dos cadernos do Currículo Paulista. */

const ETAPAS = [
  { id: "fundamental", rotulo: "Ensino fundamental", curto: "Fundamental", nota: "Anos finais · 6º ao 9º ano" },
  { id: "medio", rotulo: "Ensino médio", curto: "Médio", nota: "1ª à 3ª série" },
];

const SERIES = [
  { id: "6ano", rotulo: "6º ano", busca: "6 ano sexto fundamental", etapa: "fundamental" },
  { id: "7ano", rotulo: "7º ano", busca: "7 ano setimo fundamental", etapa: "fundamental" },
  { id: "8ano", rotulo: "8º ano", busca: "8 ano oitavo fundamental", etapa: "fundamental" },
  { id: "9ano", rotulo: "9º ano", busca: "9 ano nono fundamental", etapa: "fundamental" },
  { id: "1em", rotulo: "1ª série", busca: "1 serie primeiro ano medio", etapa: "medio" },
  { id: "2em", rotulo: "2ª série", busca: "2 serie segundo ano medio", etapa: "medio" },
  { id: "3em", rotulo: "3ª série", busca: "3 serie terceiro ano medio terceirao", etapa: "medio" },
];

function drive(id) {
  return "https://drive.google.com/file/d/" + id + "/preview";
}

const CADERNOS = [
  // ── 6º ANO ──
  { id: "6ano-b1-chglp", bimestre: 1, serie: "6ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: false, paginas: 322, bytes: 244839447, url: drive("1oKYTkunaoSMCTtQ9ccKjcAZCDg-iUb93") },
  { id: "6ano-b1-lm",    bimestre: 1, serie: "6ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 254, bytes: 127224906, url: drive("17QoMYFnP4t8PxrRAYo4nExkosJDAmH6N") },
  { id: "6ano-b2-chglp", bimestre: 2, serie: "6ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: false, paginas: 354, bytes: 254212336, url: drive("1aVI-aX0lMTj6pMRnaheIe2pNNWmbmyee") },
  { id: "6ano-b2-lm",    bimestre: 2, serie: "6ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 278, bytes: 110922216, url: drive("1ec6WcXcgX4oUc9zvFSNM3KdMPhmXruDA") },
  { id: "6ano-b3-clp",   bimestre: 3, serie: "6ano", materias: ["Ciências", "Língua Inglesa", "Projeto de Vida"],     gabarito: false, paginas: 138, bytes:  67799071, url: "https://acervocmsp.educacao.sp.gov.br/159114/1657643.pdf" },
  { id: "6ano-b3-hg",    bimestre: 3, serie: "6ano", materias: ["História", "Geografia"],                              gabarito: false, paginas: 178, bytes:  95856168, url: "https://acervocmsp.educacao.sp.gov.br/159117/1657654.pdf" },
  { id: "6ano-b3-lm",    bimestre: 3, serie: "6ano", materias: ["Língua Portuguesa", "Matemática"],                   gabarito: false, paginas: 258, bytes:  81194972, url: "https://acervocmsp.educacao.sp.gov.br/159112/1657614.pdf" },

  // ── 7º ANO ──
  { id: "7ano-b1-chglp", bimestre: 1, serie: "7ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: false, paginas: 314, bytes: 206547566, url: drive("1CiLMQqB7leQBMv7HYn52X5p0bQxL-2-F") },
  { id: "7ano-b1-lm",    bimestre: 1, serie: "7ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 290, bytes:  95438777, url: drive("1NEqUKFguU3GT_R-s88fcYdC6QGeYGHc0") },
  { id: "7ano-b2-chglp", bimestre: 2, serie: "7ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: true,  paginas: 330, bytes: 180240276, url: drive("1KTtUAJRnqnw9Siln-I5iUtQ8OyhesGWp") },
  { id: "7ano-b2-lm",    bimestre: 2, serie: "7ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: false, paginas: 290, bytes: 118350911, url: drive("1KTtUAJRnqnw9Siln-I5iUtQ8OyhesGWp") },
  { id: "7ano-b3-clp",   bimestre: 3, serie: "7ano", materias: ["Ciências", "Língua Inglesa", "Projeto de Vida"],     gabarito: false, paginas: 146, bytes:  95184703, url: "https://acervocmsp.educacao.sp.gov.br/159129/1657718.pdf" },
  { id: "7ano-b3-hg",    bimestre: 3, serie: "7ano", materias: ["História", "Geografia"],                              gabarito: false, paginas: 170, bytes: 120783685, url: "https://acervocmsp.educacao.sp.gov.br/159132/1657736.pdf" },
  { id: "7ano-b3-lm",    bimestre: 3, serie: "7ano", materias: ["Língua Portuguesa", "Matemática"],                   gabarito: false, paginas: 258, bytes:  69316750, url: "https://acervocmsp.educacao.sp.gov.br/159124/1657696.pdf" },

  // ── 8º ANO ──
  { id: "8ano-b1-chglp", bimestre: 1, serie: "8ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: false, paginas: 298, bytes: 154851042, url: drive("1KoMBu-3YLFL5GyTdV8r1XR39QOy4ImzI") },
  { id: "8ano-b1-lm",    bimestre: 1, serie: "8ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 258, bytes: 126379212, url: drive("1hJZCUTN2dweufViC-77KF7s_Ft9U_hc6") },
  { id: "8ano-b2-chglp", bimestre: 2, serie: "8ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: true,  paginas: 314, bytes: 171074553, url: "https://acervocmsp.educacao.sp.gov.br/155467/1581688.pdf" },
  { id: "8ano-b2-lm",    bimestre: 2, serie: "8ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 314, bytes: 109238011, url: "https://acervocmsp.educacao.sp.gov.br/155471/1581707.pdf" },
  { id: "8ano-b3-clp",   bimestre: 3, serie: "8ano", materias: ["Ciências", "Língua Inglesa", "Projeto de Vida"],     gabarito: false, paginas: 170, bytes: 105881793, url: "https://acervocmsp.educacao.sp.gov.br/159143/1657780.pdf" },
  { id: "8ano-b3-hg",    bimestre: 3, serie: "8ano", materias: ["História", "Geografia"],                              gabarito: false, paginas: 138, bytes:  75485869, url: "https://acervocmsp.educacao.sp.gov.br/159147/1657799.pdf" },
  { id: "8ano-b3-lm",    bimestre: 3, serie: "8ano", materias: ["Língua Portuguesa", "Matemática"],                   gabarito: false, paginas: 282, bytes: 100735209, url: "https://acervocmsp.educacao.sp.gov.br/159139/1657771.pdf" },

  // ── 9º ANO ──
  { id: "9ano-b1-chglp", bimestre: 1, serie: "9ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: false, paginas: 338, bytes: 126515361, url: drive("1n4WKtKtWFEnEZusU-6vav0ucVzDrqkwq") },
  { id: "9ano-b1-lm",    bimestre: 1, serie: "9ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 282, bytes: 133089207, url: drive("1hJZCUTN2dweufViC-77KF7s_Ft9U_hc6") },
  { id: "9ano-b2-chglp", bimestre: 2, serie: "9ano", materias: ["Ciências", "História", "Geografia", "Língua Inglesa", "Projeto de Vida"], gabarito: true,  paginas: 342, bytes: 135440720, url: drive("1n4WKtKtWFEnEZusU-6vav0ucVzDrqkwq") },
  { id: "9ano-b2-lm",    bimestre: 2, serie: "9ano", materias: ["Língua Portuguesa", "Matemática"], gabarito: true,  paginas: 322, bytes: 106354895, url: drive("1n4WKtKtWFEnEZusU-6vav0ucVzDrqkwq") },
  { id: "9ano-b3-clp",   bimestre: 3, serie: "9ano", materias: ["Ciências", "Língua Inglesa", "Projeto de Vida"],     gabarito: false, paginas: 170, bytes:  55311638, url: "https://acervocmsp.educacao.sp.gov.br/159156/1657849.pdf" },
  { id: "9ano-b3-hg",    bimestre: 3, serie: "9ano", materias: ["História", "Geografia"],                              gabarito: false, paginas: 178, bytes: 115497325, url: "https://acervocmsp.educacao.sp.gov.br/159159/1657861.pdf" },
  { id: "9ano-b3-lm",    bimestre: 3, serie: "9ano", materias: ["Língua Portuguesa", "Matemática"],                   gabarito: false, paginas: 266, bytes: 103961951, url: drive("1n4WKtKtWFEnEZusU-6vav0ucVzDrqkwq") },

  // ── 1ª SÉRIE ──
  { id: "1em-b1-bfq",  bimestre: 1, serie: "1em", materias: ["Biologia", "Física", "Química"],            gabarito: true,  paginas: 207, bytes:  47838822, url: drive("1sID3JegDBEYtuHZewTjhLdUJwAzo2wXa") },
  { id: "1em-b1-hgl",  bimestre: 1, serie: "1em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: true,  paginas: 218, bytes: 120565364, url: drive("1ErrBQ1DHBI5ldK2pJAiDJZK5S7fzjjJi") },
  { id: "1em-b1-lm",   bimestre: 1, serie: "1em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 290, bytes:  62184268, url: drive("1QrAANkXVJMwYW3qJ5wnDixfxgJMxXtiP") },
  { id: "1em-b2-bfq",  bimestre: 2, serie: "1em", materias: ["Biologia", "Física", "Química"],            gabarito: true,  paginas: 218, bytes:  41099390, url: drive("1rpIEZvyQyc97kL9DrHBvxgZ8q5xprS-D") },
  { id: "1em-b2-hgl",  bimestre: 2, serie: "1em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: true,  paginas: 186, bytes:  63794357, url: drive("1SlOGZBCSKPosezrg5Y_HCUz77QqAm89I") },
  { id: "1em-b2-lm",   bimestre: 2, serie: "1em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 290, bytes:  36197396, url: drive("1KKMDLc8czis5-IB4gwg-qVmRw-qVRfEe") },
  { id: "1em-b3-bfq",  bimestre: 3, serie: "1em", materias: ["Biologia", "Física", "Química"],            gabarito: false, paginas: 210, bytes:  48852801, url: "https://acervocmsp.educacao.sp.gov.br/159072/1657331.pdf" },
  { id: "1em-b3-hgl",  bimestre: 3, serie: "1em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: false, paginas: 178, bytes:  57041255, url: "https://acervocmsp.educacao.sp.gov.br/159074/1657382.pdf" },
  { id: "1em-b3-lm",   bimestre: 3, serie: "1em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: false, paginas: 282, bytes:  35780864, url: "https://acervocmsp.educacao.sp.gov.br/159093/1657490.pdf" },

  // ── 2ª SÉRIE ──
  { id: "2em-b1-bfq",  bimestre: 1, serie: "2em", materias: ["Biologia", "Física", "Química"],            gabarito: true,  paginas: 186, bytes:  47460094, url: "https://acervocmsp.educacao.sp.gov.br/150848/1500837.pdf" },
  { id: "2em-b1-hgl",  bimestre: 1, serie: "2em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: true,  paginas: 210, bytes:  94075586, url: "https://acervocmsp.educacao.sp.gov.br/150774/1520452.pdf" },
  { id: "2em-b1-lm",   bimestre: 1, serie: "2em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 258, bytes:  88355392, url: "https://acervocmsp.educacao.sp.gov.br/150744/1590491.pdf" },
  { id: "2em-b2-bfq",  bimestre: 2, serie: "2em", materias: ["Biologia", "Física", "Química"],            gabarito: true,  paginas: 210, bytes:  58408706, url: drive("1mFaa5ZXt2_gSf8qtgDu4Ynb1YUozSy9_") },
  { id: "2em-b2-hgl",  bimestre: 2, serie: "2em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: true,  paginas: 226, bytes: 107216293, url: drive("1RtDsG2gLj-YPdi_Mk9P3z5GEdsN1fb7q") },
  { id: "2em-b2-lm",   bimestre: 2, serie: "2em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 242, bytes:  31248653, url: drive("1c0Z2FEEiNybHVIttBbI44xNd9Nddfecu") },
  { id: "2em-b3-bfq",  bimestre: 3, serie: "2em", materias: ["Biologia", "Física", "Química"],            gabarito: false, paginas: 170, bytes:  47748799, url: "https://acervocmsp.educacao.sp.gov.br/159095/1657500.pdf" },
  { id: "2em-b3-hgl",  bimestre: 3, serie: "2em", materias: ["História", "Geografia", "Língua Inglesa"],  gabarito: false, paginas: 202, bytes:  58971863, url: "https://acervocmsp.educacao.sp.gov.br/159102/1657524.pdf" },
  { id: "2em-b3-lm",   bimestre: 3, serie: "2em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: false, paginas: 242, bytes:  35201001, url: "https://acervocmsp.educacao.sp.gov.br/159104/1657537.pdf" },

  // ── 3ª SÉRIE ──
  { id: "3em-b1-fhl",  bimestre: 1, serie: "3em", materias: ["Física", "História", "Língua Inglesa"],     gabarito: true,  paginas: 198, bytes:  92641550, url: drive("1ea1uJCX3sGEKboljK3ueaVsyCyYcCMuv") },
  { id: "3em-b1-lm",   bimestre: 1, serie: "3em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 298, bytes:  38594050, url: drive("1GZjcJtFddCo4wjyCtb3ebN3ae-rMWcsa") },
  { id: "3em-b2-fhl",  bimestre: 2, serie: "3em", materias: ["Física", "História", "Língua Inglesa"],     gabarito: true,  paginas: 194, bytes:  65429616, url: drive("1nWViNUldYrcRsOsbt7vDqRjco45lxzO3") },
  { id: "3em-b2-lm",   bimestre: 2, serie: "3em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: true,  paginas: 286, bytes:  78071960, url: drive("1NS_YjVTDvew7W_UOVwxhX3C0wwOLXCHY") },
  { id: "3em-b3-fhl",  bimestre: 3, serie: "3em", materias: ["Física", "História", "Língua Inglesa"],     gabarito: false, paginas: 202, bytes:  78516188, url: "https://acervocmsp.educacao.sp.gov.br/159106/1657566.pdf" },
  { id: "3em-b3-lm",   bimestre: 3, serie: "3em", materias: ["Língua Portuguesa", "Matemática"],          gabarito: false, paginas: 282, bytes:  40329131, url: "https://acervocmsp.educacao.sp.gov.br/159108/1657577.pdf" },
];
