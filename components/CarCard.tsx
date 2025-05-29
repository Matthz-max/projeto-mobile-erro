import React from 'react';
import { Box, Pressable, Text, Image, IconButton, HStack, useTheme } from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export interface CarData {
  id?: string | number;
  nome: string;
  marca?: string;
  imagem: string;
  modelo?: string;
  ano?: string | number;
}

interface CarCardProps {
  carData: CarData;
  onPress: () => void;
  isFavorited: (car: CarData) => boolean;
  onToggleFavorite: (car: CarData) => void;
  onDelete?: (car: CarData) => void;
  bgColor?: string;
}

export default function CarCard({
  carData,
  onPress,
  isFavorited,
  onToggleFavorite,
  onDelete,
  bgColor = 'white',
}: CarCardProps) {
  const favorited = isFavorited(carData);
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} mb={4}>
      <Box bg={bgColor} borderRadius="xl" shadow={2} p={4} flexDirection="row" alignItems="center">
        <Image
          source={{ uri: carData.imagem }}
          alt={carData.nome}
          size="lg"
          resizeMode="contain"
          borderRadius="lg"
          mr={4}
          width={100}
          height={60}
        />
        <Box flex={1}>
          <Text fontWeight="bold" fontSize="md" mb={1} color={colors.white}>
            {carData.nome}
          </Text>
          <Text fontSize="sm" color={colors.gray['500']} mb={2}>
            {carData.marca || 'Marca desconhecida'}
          </Text>
          <HStack space={2} alignItems="center">
            <IconButton
              icon={
                <Ionicons
                  name={favorited ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorited ? colors.red['500'] : colors.gray['600']}
                />
              }
              onPress={() => onToggleFavorite(carData)}
              _pressed={{ bg: 'transparent' }}
              accessibilityLabel={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            />
            {onDelete && (
              <IconButton
                icon={
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color={colors.red['500']}
                  />
                }
                onPress={() => onDelete(carData)}
                _pressed={{ bg: 'transparent' }}
                accessibilityLabel="Excluir carro"
              />
            )}
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
}
