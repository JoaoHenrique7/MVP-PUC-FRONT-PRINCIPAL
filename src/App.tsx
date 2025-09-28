import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

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

  // Função para mostrar alertas de sucesso
  const showSuccessAlert = (title: string, text: string = "") => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'

    });
  };

  // Função para mostrar alertas de erro
  const showErrorAlert = (title: string, text: string = "") => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  };

  // Função para mostrar confirmação
  const showConfirmAlert = (title: string, text: string = "") => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, confirmar!',
      cancelButtonText: 'Cancelar'
    });
  };

  // Carrega endereços
  const loadEnderecos = React.useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao carregar endereços");
      const data = await res.json();

      // Garante que é um array
      if (Array.isArray(data.enderecos)) {
        setEnderecos(data.enderecos);
      } else {
        setEnderecos([]);
        console.warn("Resposta inesperada da API:", data);
      }
    } catch (err) {
      console.error(err);
      showErrorAlert("Erro!", "Não foi possível carregar os endereços.");
    }
  }, []);

  useEffect(() => {
    loadEnderecos();
  }, [loadEnderecos]);

  // Adicionar endereço
  const addEndereco = async () => {
    if (!cep) {
      showErrorAlert("CEP obrigatório", "Por favor, digite um CEP válido.");
      return;
    }

    // Validação básica de CEP (8 dígitos)
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      showErrorAlert("CEP inválido", "O CEP deve conter 8 dígitos.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: cepLimpo }),
      });

      if (res.ok) {
        setCep("");
        showSuccessAlert("Endereço adicionado!", "O endereço foi cadastrado com sucesso.");
        loadEnderecos();
      } else {
        const errorData = await res.json();
        showErrorAlert("Erro ao adicionar", errorData.message || "Não foi possível adicionar o endereço.");
      }
    } catch {
      showErrorAlert("Erro de conexão", "Verifique se o servidor está rodando.");
    }
  };

  // Deletar endereço
  const deleteEndereco = async (id: number, enderecoInfo: string) => {
    const result = await showConfirmAlert(
      "Excluir endereço?",
      `Tem certeza que deseja excluir o endereço: ${enderecoInfo}? Esta ação não pode ser desfeita.`
    );

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
          showSuccessAlert("Endereço excluído!", "O endereço foi removido com sucesso.");
          loadEnderecos();
        } else {
          showErrorAlert("Erro ao excluir", "Não foi possível excluir o endereço.");
        }
      } catch {
        showErrorAlert("Erro de conexão", "Não foi possível conectar ao servidor.");
      }
    }
  };

  // Salvar edição
  const saveEdit = async () => {
    if (editId === null) return;

    // Validação dos campos
    if (!editData.cep || editData.cep.replace(/\D/g, '').length !== 8) {
      showErrorAlert("CEP inválido", "O CEP deve conter 8 dígitos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditId(null);
        setEditData({});
        showSuccessAlert("Alterações salvas!", "O endereço foi atualizado com sucesso.");
        loadEnderecos();
      } else {
        showErrorAlert("Erro ao salvar", "Não foi possível salvar as alterações.");
      }
    } catch {
      showErrorAlert("Erro de conexão", "Verifique a conexão com o servidor.");
    }
  };

  // Alterar campos de edição
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Endereco) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  // Formatar CEP durante a digitação
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    setCep(value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "Arial",
        backgroundColor: "silver",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%", backgroundColor: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>📍 Gerenciador de Endereços</h1>

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
            placeholder="Digite o CEP (00000-000)"
            value={cep}
            onChange={handleCepChange}
            style={{
              padding: "0.75rem",
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "1rem"
            }}
            maxLength={9}
          />
          <button
            onClick={addEndereco}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Adicionar
          </button>
        </div>

        {/* Lista de endereços */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {enderecos.length > 0 ? (
            enderecos.map((end) => (
              <li
                key={end.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  borderRadius: "5px",
                  backgroundColor: "#fafafa"
                }}
              >
                {editId === end.id ? (
                  // Modo edição
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      value={editData.cep || ""}
                      placeholder="CEP"
                      onChange={(e) => handleEditChange(e, "cep")}
                      style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "3px" }}
                    />
                    <input
                      value={editData.logradouro || ""}
                      placeholder="Logradouro"
                      onChange={(e) => handleEditChange(e, "logradouro")}
                      style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "3px" }}
                    />
                    <input
                      value={editData.bairro || ""}
                      placeholder="Bairro"
                      onChange={(e) => handleEditChange(e, "bairro")}
                      style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "3px" }}
                    />
                    <input
                      value={editData.localidade || ""}
                      placeholder="Cidade"
                      onChange={(e) => handleEditChange(e, "localidade")}
                      style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "3px" }}
                    />
                    <input
                      value={editData.uf || ""}
                      placeholder="UF"
                      onChange={(e) => handleEditChange(e, "uf")}
                      style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "3px" }}
                      maxLength={2}
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={saveEdit}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer"
                        }}
                      >
                        💾 Salvar
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer"
                        }}
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo visualização
                  <div>
                    {/* <strong>{end.cep}</strong> - {end.logradouro}, {end.bairro}, {end.localidade}/{end.uf} */}
                    <div style={{ color: "#000000" }}>
                      <strong>{end.cep}</strong> - {end.logradouro}, {end.bairro}, {end.localidade}/{end.uf}
                    </div>
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
                        style={{
                          padding: "0.4rem 0.8rem",
                          backgroundColor: "#ffc107",
                          color: "black",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer"
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => deleteEndereco(end.id, `${end.cep} - ${end.logradouro}`)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "3px",
                          cursor: "pointer"
                        }}
                      >
                        🗑 Excluir
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li style={{ textAlign: "center", color: "#666" }}>
              Nenhum endereço encontrado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;