import { useState, useEffect, type ChangeEvent } from "react";

const API_URL = "http://localhost:5000/enderecos";

// Tipagem do endereço
interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

function App() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [cep, setCep] = useState<string>("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Endereco>>({
    cep: "",
    logradouro: "",
    bairro: "",
    localidade: "",
    uf: "",
  });

  // Buscar endereços ao carregar
  useEffect(() => {
    fetchEnderecos();
  }, []);

  const fetchEnderecos = async () => {
    const res = await fetch(API_URL);
    const data: Endereco[] = await res.json();
    setEnderecos(data);
  };

  // Adicionar endereço pelo CEP
  const addEndereco = async () => {
    if (!cep) {
      alert("Informe um CEP!");
      return;
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep }),
    });
    if (res.ok) {
      setCep("");
      fetchEnderecos();
    } else {
      const err = await res.json();
      alert(err.error || "Erro ao adicionar");
    }
  };

  // Excluir endereço
  const deleteEndereco = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchEnderecos();
    } else {
      alert("Erro ao excluir");
    }
  };

  // Salvar edição (PUT)
  const saveEdit = async () => {
    if (!editId) return;
    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setEditId(null);
      fetchEnderecos();
    } else {
      alert("Erro ao atualizar");
    }
  };

  // Alterar inputs do formulário de edição
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Endereco
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial" }}>
      <h1>📍 Gerenciador de Endereços</h1>

      {/* Adicionar endereço */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Digite o CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={addEndereco}>Adicionar</button>
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
              <div>
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
                <button onClick={saveEdit}>💾 Salvar</button>
                <button onClick={() => setEditId(null)}>❌ Cancelar</button>
              </div>
            ) : (
              // Modo visualização
              <div>
                <strong>{end.cep}</strong> - {end.logradouro}, {end.bairro},{" "}
                {end.localidade}/{end.uf}
                <div style={{ marginTop: "0.5rem" }}>
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
                    style={{ marginRight: "0.5rem" }}
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
  );
}

export default App;
