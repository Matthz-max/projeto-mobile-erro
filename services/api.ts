export interface CarData {
  id?: number;          // id gerado pelo backend (Long)
  nome: string;
  modelo?: string;
  ano?: string;
  imagem: string;
  isFavorite?: boolean;
}

const API_KEY = '7631d9dc-eb1c-4a6f-ae0e-3b2009195bf8';

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

    // Salvar no backend
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
  const response = await fetch('http://localhost:8080/cars/salvar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar carro no backend');
  }

  return response.json();
}

export async function fetchAllCars(): Promise<CarData[]> {
  const res = await fetch('http://localhost:8080/cars/listar');
  if (!res.ok) throw new Error('Erro ao buscar carros');
  return res.json();
}

export async function deleteCarById(id: number): Promise<void> {
  const res = await fetch(`http://localhost:8080/cars/deletar/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar carro');
}

export async function updateFavorite(id: number, isFavorite: boolean): Promise<CarData> {
  const res = await fetch(`http://localhost:8080/cars/${id}/favorite?isFavorite=${isFavorite}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Erro ao atualizar favorito');
  return res.json();
}
