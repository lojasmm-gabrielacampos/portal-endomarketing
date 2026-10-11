import { useMemo, useRef, useState } from "react";
import { PenLine, Copy, Upload, Download } from "lucide-react";
import { Field, PageHead, PreviewShell, ImageDropzone } from "../../components/ui";
import { maskPhone } from "../../utils/format";
import { copiarHTML, copiarTexto } from "../../utils/clipboard";
import { exportarHtmlComoPNG } from "../../utils/files";
import { buildSignature } from "./buildSignature";

export default function AssinaturaScreen() {
  const [nome, setNome] = useState("");
  const [depto, setDepto] = useState("");
  const [fone, setFone] = useState("");
  const [comFoto, setComFoto] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState(""); // "" | "sig" | "code" | "png"
  const fileRef = useRef(null);
  const renderRef = useRef(null);

  const fotoUsada = comFoto ? photo : null;
  const dados = { nome: nome.trim(), depto: depto.trim(), fone: fone.trim(), photo: fotoUsada };
  const faltaFoto = comFoto && !photo;
  const valido = !!(dados.nome && dados.depto) && !faltaFoto;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const html = useMemo(() => buildSignature(dados), [nome, depto, fone, fotoUsada]);

  function removerFoto() {
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function limpar() {
    setNome(""); setDepto(""); setFone(""); setErro(""); setAviso("");
    removerFoto();
  }

  function flash(which) {
    setAviso(which);
    setTimeout(() => setAviso(""), 1600);
  }

  function exigirValido() {
    if (valido) return true;
    setErro(faltaFoto && dados.nome && dados.depto
      ? "Envie a foto ou escolha a versão sem foto."
      : "Preencha nome completo e departamento/filial para gerar a assinatura.");
    return false;
  }

  async function copiarCodigo() {
    if (!exigirValido()) return;
    await copiarTexto(html);
    flash("code");
  }

  async function copiarAssinatura() {
    if (!exigirValido()) return;
    await copiarHTML(html);
    flash("sig");
  }

  async function baixarImagem() {
    if (!exigirValido()) return;
    const tabela = renderRef.current?.querySelector("table");
    if (!tabela) return;
    await exportarHtmlComoPNG(html, {
      largura: tabela.offsetWidth,
      altura: tabela.offsetHeight,
      nome: `assinatura-${dados.nome.toLowerCase().replace(/\s+/g, "-")}.png`,
    });
    flash("png");
  }

  return (
    <div className="screen">
      <PageHead icon={PenLine} titulo="Gerador de Assinatura de E-mail"
        sub="Layout, fontes, cores e logotipo fixos no padrão Grupo MM. Escolha a versão com ou sem foto." />
      <div className="sig-work">
        <div className="form-card">
          <h3 className="form-title">Dados da assinatura</h3>
          <div className="grid-2">
            <Field label="Nome completo">
              <input className={`input ${erro && !dados.nome ? "err" : ""}`} value={nome}
                placeholder="Ex.: Ana Souza" autoComplete="name"
                onChange={(e) => { setNome(e.target.value); setErro(""); }} />
            </Field>
            <Field label="Departamento ou filial">
              <input className={`input ${erro && !dados.depto ? "err" : ""}`} value={depto}
                placeholder="Ex.: Recursos Humanos"
                onChange={(e) => { setDepto(e.target.value); setErro(""); }} />
            </Field>
            <Field label="Telefone">
              <input className="input" value={fone} inputMode="numeric" maxLength={15}
                placeholder="(00) 00000-0000"
                onChange={(e) => setFone(maskPhone(e.target.value))} />
            </Field>
            <Field label="Versão">
              <div className="segmented">
                <button type="button" className={comFoto ? "active" : ""}
                  onClick={() => { setComFoto(true); setErro(""); }}>Com foto</button>
                <button type="button" className={!comFoto ? "active" : ""}
                  onClick={() => { setComFoto(false); setErro(""); }}>Sem foto</button>
              </div>
            </Field>
          </div>

          {comFoto && (
            <Field label="Foto" hint="Retrato redondo à esquerda do nome. Foto quadrada fica melhor.">
              <div className="sig-photo-row">
                <ImageDropzone preenchido={!!photo} inputRef={fileRef}
                  className={erro && faltaFoto ? "err" : ""}
                  onImagem={(d) => { setPhoto(d); setErro(""); }}>
                  {photo ? (
                    <><img className="sig-photo-thumb" src={photo} alt="Prévia da foto" /><span>Trocar foto</span></>
                  ) : (
                    <><Upload size={18} /><span>Enviar foto</span><small>PNG ou JPG</small></>
                  )}
                </ImageDropzone>
                {photo && <button type="button" className="sig-rm" onClick={removerFoto}>remover</button>}
              </div>
            </Field>
          )}

          {erro && <div className="sig-err">{erro}</div>}

          <div className="gen-row">
            <button className="btn btn-primary" disabled={!valido} onClick={copiarAssinatura}>
              <Copy size={16} /> Copiar assinatura
            </button>
            <button className="btn btn-ghost" disabled={!valido} onClick={baixarImagem}>
              <Download size={16} /> Baixar imagem (PNG)
            </button>
            <button className="btn btn-ghost" onClick={limpar}>Limpar campos</button>
            {aviso === "sig" && <span className="sig-toast">Assinatura copiada</span>}
            {aviso === "png" && <span className="sig-toast">Imagem baixada</span>}
          </div>
        </div>

        <div className="sig-result">
          <PreviewShell>
            {valido ? (
              <div className="sig-render" ref={renderRef} dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="sig-empty">
                {faltaFoto && dados.nome && dados.depto
                  ? <>Envie a <strong>foto</strong> ou escolha a versão <strong>sem foto</strong>.</>
                  : <>Preencha <strong>nome completo</strong> e <strong>departamento/filial</strong> para ver a prévia.</>}
              </div>
            )}
            <span className="preview-note">A prévia atualiza enquanto você digita.</span>
          </PreviewShell>

          <div className="outputs">
            <div className="sig-out-head">
              <h4>Código HTML</h4>
              {aviso === "code" && <span className="sig-toast">Código copiado</span>}
              <button className="btn btn-ghost sm" disabled={!valido} onClick={copiarCodigo}>
                <Copy size={14} /> Copiar código
              </button>
            </div>
            <textarea className="sig-code" readOnly spellCheck={false}
              value={valido ? html : ""}
              placeholder="O código HTML aparece aqui depois de preencher os campos obrigatórios." />
          </div>
        </div>
      </div>
    </div>
  );
}
