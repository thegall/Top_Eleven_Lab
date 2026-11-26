'use client';

import { useState, type FormEvent } from 'react';

import { useSquad } from '../state/store';
import { useTextos } from '../ui/idioma';

/** Iniciais provisórias: até duas letras, da primeira e da última palavra do nome. */
export function iniciais(nome: string): string {
  const palavras = nome.trim().split(/\s+/).filter(Boolean);
  if (palavras.length === 0) return '';
  const primeira = palavras[0] ?? '';
  const ultima = palavras.length > 1 ? (palavras[palavras.length - 1] ?? '') : '';
  return (Array.from(primeira)[0] ?? '').concat(Array.from(ultima)[0] ?? '').toLocaleUpperCase();
}

export default function GaleriaPage() {
  const t = useTextos().galeria;
  const { documento, carregado, adicionarJogadorGaleria } = useSquad();
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState(false);

  function aoSubmeter(e: FormEvent) {
    e.preventDefault();
    if (nome.trim() === '') {
      setErro(true);
      return;
    }
    adicionarJogadorGaleria(nome.trim());
    setNome('');
    setErro(false);
  }

  return (
    <>
      <section className="stage">
        <div className="hero">
          <h1>{t.titulo}</h1>
          <p className="hero__lead">{t.lead}</p>
        </div>
      </section>

      <main className="page">
        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>{t.adicionarTitulo}</h2>
            </div>
            <form className="form form--galeria" onSubmit={aoSubmeter} noValidate>
              <div className="field">
                <label htmlFor="galeria-nome">{t.nome}</label>
                <input
                  id="galeria-nome"
                  type="text"
                  placeholder={t.nomePlaceholder}
                  value={nome}
                  aria-invalid={erro || undefined}
                  aria-describedby={erro ? 'galeria-erro' : undefined}
                  onChange={(e) => {
                    setNome(e.target.value);
                    setErro(false);
                  }}
                />
              </div>
              <button className="btn btn--primary" type="submit">
                {t.adicionar}
              </button>
            </form>
            {erro && (
              <p id="galeria-erro" className="form__erro" role="alert">
                {t.erroNome}
              </p>
            )}
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>{t.listaTitulo}</h2>
            </div>
            {!carregado ? null : documento.galeria.length === 0 ? (
              <div className="empty">
                <strong>{t.vazioTitulo}</strong>
                <p>{t.vazioTexto}</p>
              </div>
            ) : (
              <ul className="galeria-lista">
                {documento.galeria.map((jogador) => (
                  <li key={jogador.id} className="galeria-item">
                    <span className="galeria-item__iniciais" aria-hidden="true">
                      {iniciais(jogador.nome)}
                    </span>
                    <span className="galeria-item__nome">{jogador.nome}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
