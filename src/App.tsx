import React, { useState, useEffect } from "react";

interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const API_URL = "http://localhost:5000/enderecos";

export const App: React.FC = () => {
  const [cep, setCep] = useState("");
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Endereco>>({});

  // Carrega endereços
  const loadEnderecos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setEnderecos(data);
  };

  useEffect(() => {
    loadEnderecos();
  }, []);

  // Adicionar endereço
  const addEndereco = async () => {
    if (!cep) return alert("Digite um CEP");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep }),
    });
    if (res.ok) {
      setCep("");
      loadEnderecos();
    } else {
      alert("Erro ao adicionar endereço");
    }
  };

  // Deletar endereço
  const deleteEndereco = async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) loadEnderecos();
  };

  // Salvar edição
  const saveEdit = async () => {
    if (editId === null) return;
    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setEditId(null);
      setEditData({});
      loadEnderecos();
    }
  };

  // Alterar campos de edição
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Endereco) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Arial",
        padding: "1rem",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>📍 Gerenciador de Endereços</h1>

        {/* Adicionar endereço */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Digite o CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            style={{ padding: "0.5rem", flex: 1 }}
          />
          <button onClick={addEndereco} style={{ padding: "0.5rem 1rem" }}>
            Adicionar
          </button>
        </div>

        {/* Lista de endereços */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {enderecos.map((end) => (
            <li
              key={end.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "0.5rem",
                borderRadius: "5px",
              }}
            >
              {editId === end.id ? (
                // Modo edição
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    value={editData.cep || ""}
                    placeholder="CEP"
                    onChange={(e) => handleEditChange(e, "cep")}
                  />
                  <input
                    value={editData.logradouro || ""}
                    placeholder="Logradouro"
                    onChange={(e) => handleEditChange(e, "logradouro")}
                  />
                  <input
                    value={editData.bairro || ""}
                    placeholder="Bairro"
                    onChange={(e) => handleEditChange(e, "bairro")}
                  />
                  <input
                    value={editData.localidade || ""}
                    placeholder="Cidade"
                    onChange={(e) => handleEditChange(e, "localidade")}
                  />
                  <input
                    value={editData.uf || ""}
                    placeholder="UF"
                    onChange={(e) => handleEditChange(e, "uf")}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={saveEdit}>💾 Salvar</button>
                    <button onClick={() => setEditId(null)}>❌ Cancelar</button>
                  </div>
                </div>
              ) : (
                // Modo visualização
                <div>
                  <strong>{end.cep}</strong> - {end.logradouro}, {end.bairro}, {end.localidade}/{end.uf}
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => {
                        setEditId(end.id);
                        setEditData({
                          cep: end.cep,
                          logradouro: end.logradouro,
                          bairro: end.bairro,
                          localidade: end.localidade,
                          uf: end.uf,
                        });
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button onClick={() => deleteEndereco(end.id)}>🗑 Excluir</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
