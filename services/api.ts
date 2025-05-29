import axios from 'axios';

export interface CarData {
  name: string;
  imageUrl: string;
  brand?: string;
  year?: number;
}

export const fetchCarImage = async (carName: string): Promise<string | null> => {
  try {
    const response = await axios.get('https://www.carimagery.com/api.asmx/GetImageUrl', {
      params: { searchTerm: carName },
    });

    const regex = /<string xmlns="http:\/\/carimagery.com\/">(.+)<\/string>/;
    const match = regex.exec(response.data);

    return match ? match[1] : null;
  } catch (error) {
    console.error('Erro ao buscar imagem do Car Imagery:', error);
    return null;
  }
};

export const fetchCarData = async (carName: string): Promise<CarData | null> => {
  try {
    const image = await fetchCarImage(carName);

    return {
      name: carName,
      imageUrl: image || 'https://via.placeholder.com/350x196.png?text=Sem+imagem',
      brand: undefined, // opcional, pode ficar vazio
      year: undefined,
    };
  } catch (error) {
    console.error('Erro no fetchCarData:', error);
    return null;
  }
};
