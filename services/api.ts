import axios from 'axios';

export interface CarData {
  id?: number;
  nome: string;
  modelo?: string;
  ano?: string;
  imagem: string;
  isFavorite?: boolean;
}

const API_BASE = 'http://localhost:8080/cars';

export async function fetchCarData(carName: string): Promise<CarData | null> {
  if (!carName.trim()) return null;

  try {
    const imageUrl = await fetchCarImage(carName);

    const car: Omit<CarData, 'id'> = {
      nome: carName,
      modelo: undefined,
      ano: undefined,
      imagem: imageUrl || 'https://via.placeholder.com/350x196.png?text=Sem+imagem',
      isFavorite: false,
    };

    const savedCar = await postCarToBackend(car);
    return savedCar;
  } catch (error) {
    console.error('Erro ao buscar e salvar carro:', error);
    return null;
  }
}

async function fetchCarImage(carName: string): Promise<string | null> {
  const url = `https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${encodeURIComponent(carName)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar imagem');
  const text = await res.text();

  const regex = /<string xmlns="http:\/\/carimagery.com\/">([\s\S]+)<\/string>/;
  const match = text.match(regex);
  if (match && match[1]) return match[1];
  return null;
}

async function postCarToBackend(car: Omit<CarData, 'id'>): Promise<CarData> {
  const response = await axios.post<CarData>(`${API_BASE}/salvar`, car, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

export async function fetchAllCars(): Promise<CarData[]> {
  const response = await axios.get<CarData[]>(`${API_BASE}/listar`);
  return response.data;
}

export async function deleteCarById(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/deletar/${id}`);
}

export async function updateFavorite(id: number, isFavorite: boolean): Promise<CarData> {
  const response = await axios.put<CarData>(
    `${API_BASE}/${id}/favorite`,
    { isFavorite }, // corpo JSON conforme backend espera
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}
