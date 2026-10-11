# Portal de Endomarketing — Grupo MM

Ferramentas de autoatendimento para produzir materiais internos padronizados
(ver `Descricao.md`). Acesso pela rede interna, sem login.

## Rodar

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # gera a pasta dist/ para publicar na rede interna
```

## Funcionalidades

| Tela | Pasta |
| --- | --- |
| 3.1 Cronograma do Café | `src/pages/Cafe` |
| 3.2 Assinatura de E-mail | `src/pages/Assinatura` |
| 3.3 Foto Corporativa | `src/pages/Foto` |
| 3.4 Calendário de Aniversariantes | `src/pages/Aniversario` |
| 3.5 Materiais para Download | `src/pages/Materiais` |

## Imagens

Todas as imagens são referenciadas em **`src/constants/imagens.js`**.
Campos vazios (`""`) aparecem na interface como espaço reservado.

1. Coloque o arquivo em `src/assets/<pasta>` (`cafe`, `molduras`, `aniversario`, `materiais`).
2. Importe-o em `src/constants/imagens.js` e troque a string vazia pela variável.

Não use imagens em base64 no código. Para as molduras, ajuste também
`fx`, `fy` e `fr` em `src/data/molduras.js` (centro e raio do recorte da foto).
