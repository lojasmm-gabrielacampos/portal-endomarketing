// =============================================================================
// IMAGENS DO PORTAL — único lugar para referenciar imagens.
// -----------------------------------------------------------------------------
// Como referenciar:
//   1. Coloque o arquivo na pasta indicada em src/assets/...
//   2. Importe-o no topo deste arquivo, ex.:
//        import molduraSouMM from "../assets/molduras/sou-mm.png";
//   3. Troque a string vazia "" pela variável importada.
//
// Enquanto um campo estiver vazio (""), a interface mostra um espaço reservado
// no lugar da imagem. Não use imagens em base64 aqui — sempre arquivos.
// =============================================================================

import logoGrupoMM from "../assets/logo-grupo-mm.png";
import xicoriaAssinatura from "../assets/xicoria-assinatura.png";

import meet1 from "../assets/materiais/fundo-meet-1.png";
import meet2 from "../assets/materiais/fundo-meet-2.png";
import meet3 from "../assets/materiais/fundo-meet-3.png";
import meet4 from "../assets/materiais/fundo-meet-4.png";
import meet5 from "../assets/materiais/fundo-meet-5.png";
import meet6 from "../assets/materiais/fundo-meet-6.png";
import meet7 from "../assets/materiais/fundo-meet-7.png";

import moldura1 from "../assets/molduras/moldura-1.png";
import moldura2 from "../assets/molduras/moldura-2.png";

import linkedin1 from "../assets/materiais/capa-linkedin-1.jpeg";

export const IMAGENS = {
  // Marca (interface do portal, assinatura e artes geradas)
  logo: logoGrupoMM,

  // 3.1 Cronograma do Café — pasta: src/assets/cafe/
  cafe: {
    mascote: "", // ilustração do canto inferior esquerdo do mural
  },

  // 3.2 Assinatura de e-mail
  // Obs.: para a assinatura funcionar no Outlook/Gmail, logo e mascote precisam
  // estar hospedados em URL pública absoluta (ex.: "https://.../logo.png").
  assinatura: {
    mascote: xicoriaAssinatura,
  },

  // 3.3 Foto corporativa — pasta: src/assets/molduras/
  // PNG quadrado com o centro transparente (onde entra a foto).
  molduras: {
    souMM: moldura1,
    orgulhoEmPertencer: moldura2,
  },

  // 3.4 Calendário de aniversariantes — pasta: src/assets/aniversario/
  aniversario: {
    ilustracao: "", // arte do topo do calendário
  },

  // 3.5 Materiais para download — pasta: src/assets/materiais/
  materiais: {
    meet: [meet1, meet2, meet3, meet4, meet5, meet6, meet7],     // planos de fundo Google Meet (1920 × 1080)
    linkedin: [linkedin1], // capas LinkedIn (1584 × 396)
  },
};
