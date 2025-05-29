import React, { useEffect, useState } from 'react';
import {
  Actionsheet,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  useColorMode,
  useDisclose,
  VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import CarCard, { CarData } from '../components/CarCard';
import { fetchCarData } from '../services/api';

export default function HomeScreen() {
  const [carNameInput, setCarNameInput] = useState('');
  const [carDataList, setCarDataList] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CarData | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [favorites, setFavorites] = useState<CarData[]>([]);

  const { isOpen, onOpen, onClose } = useDisclose();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclose();
  const { isOpen: isFavoritesOpen, onOpen: onFavoritesOpen, onClose: onFavoritesClose } = useDisclose();

  const { colorMode, toggleColorMode } = useColorMode();

  const colors = {
    background: colorMode === 'dark' ? '#121212' : '#f9f9f9',
    card: colorMode === 'dark' ? '#1f1f1f' : '#ffffff',
    header: colorMode === 'dark' ? '#000000' : '#FF6B00',
    textPrimary: colorMode === 'dark' ? '#e05e00' : '#000',
    textSecondary: colorMode === 'dark' ? '#aaaaaa' : '#666666',
    accent: '#FF6B00',
    inputBg: colorMode === 'dark' ? '#2c2c2c' : '#e6e6e6',
  };

  useEffect(() => {
    if (carNameInput.trim().length < 3) {
      setPreviewData(null);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const data = await fetchCarData(carNameInput);
        setPreviewData(data);
      } catch {
        setPreviewData(null);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [carNameInput]);

  const handleSearch = async () => {
    setError(null);
    if (!carNameInput.trim()) {
      setError('Digite a marca e o modelo do carro');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCarData(carNameInput);
      if (!data) {
        setError('Carro não encontrado');
      } else {
        setCarDataList(prev => {
          const exists = prev.find(c => c.nome === data.nome);
          if (exists) return prev;
          return [...prev, data];
        });
      }
    } catch {
      setError('Erro ao buscar dados do carro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const openCarModal = (car: CarData) => {
    setSelectedCar(car);
    onModalOpen();
  };

  const toggleFavorite = (car: CarData) => {
    const exists = favorites.find(f => f.nome === car.nome);
    if (exists) {
      setFavorites(favorites.filter(f => f.nome !== car.nome));
    } else {
      setFavorites([...favorites, car]);
    }
  };

  const isFavorited = (car: CarData | null) => {
    if (!car) return false;
    return favorites.some(f => f.nome === car.nome);
  };

  const handleDeleteCar = (car: CarData) => {
    setCarDataList(prev => prev.filter(c => c.nome !== car.nome));
    if (previewData && previewData.nome === car.nome) {
      setPreviewData(null);
    }
    setFavorites(prev => prev.filter(f => f.nome !== car.nome));
  };

  return (
    <>
      {/* HEADER */}
      <Box
        bg={colors.header}
        safeAreaTop
        px={5}
        py={4}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        shadow={3}
      >
        <Pressable onPress={onOpen}>
          <Ionicons name="menu" size={30} color="white" />
        </Pressable>
        <Image
          source={require('../assets/logo-removebg-preview 1.svg')}
          alt="Logo"
          size="sm"
          resizeMode="contain"
        />
      </Box>

      {/* MENU LATERAL */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content bg={colors.card} borderTopRadius="xl" py={4} maxHeight="70%">
          <ScrollView w="100%" showsVerticalScrollIndicator={true}>
            <VStack space={3} w="100%" px={4} alignItems="center" justifyContent="center">
              <Button
                variant="ghost"
                onPress={() => {
                  toggleColorMode();
                  onClose();
                }}
                w="100%"
                maxW="300px"
                justifyContent="flex-start"
              >
                <HStack alignItems="center" space={2}>
                  <Ionicons
                    name={colorMode === 'light' ? 'moon' : 'sunny'}
                    size={24}
                    color={colors.textPrimary}
                  />
                  <Text fontSize="lg" color={colors.textPrimary}>
                    Alternar Modo {colorMode === 'light' ? 'Escuro' : 'Claro'}
                  </Text>
                </HStack>
              </Button>

              <Button
                variant="ghost"
                onPress={() => {
                  onClose();
                  setCarDataList([]);
                  setPreviewData(null);
                  setCarNameInput('');
                }}
                w="100%"
                maxW="300px"
                justifyContent="flex-start"
              >
                <HStack alignItems="center" space={2}>
                  <Ionicons name="home" size={24} color={colors.textPrimary} />
                  <Text fontSize="lg" color={colors.textPrimary}>
                    Home
                  </Text>
                </HStack>
              </Button>

              <Button
                variant="ghost"
                onPress={() => {
                  onClose();
                  onFavoritesOpen();
                }}
                w="100%"
                maxW="300px"
                justifyContent="flex-start"
              >
                <HStack alignItems="center" space={2}>
                  <Ionicons name="heart" size={24} color={colors.textPrimary} />
                  <Text fontSize="lg" color={colors.textPrimary}>
                    Favoritos ({favorites.length})
                  </Text>
                </HStack>
              </Button>
            </VStack>
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>

      {/* CONTEÚDO */}
      <ScrollView
        flex={1}
        px={5}
        pt={5}
        bg={colors.background}
        keyboardShouldPersistTaps="handled"
      >
        <HStack space={3} mb={4}>
          <Input
            flex={1}
            bg={colors.inputBg}
            placeholder="Digite marca e modelo"
            value={carNameInput}
            onChangeText={setCarNameInput}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            variant="rounded"
            px={4}
            py={3}
            fontSize="md"
          />
          <Button
            bg={colors.accent}
            borderRadius="full"
            px={5}
            onPress={handleSearch}
            isDisabled={loading}
            _text={{ fontWeight: 'bold' }}
          >
            Buscar
          </Button>
        </HStack>

        {error && (
          <Text color="red.500" mb={3} textAlign="center">
            {error}
          </Text>
        )}

        {loading && (
          <Center my={6}>
            <Spinner size="lg" color={colors.accent} />
            <Text mt={3} color={colors.textPrimary}>
              Carregando...
            </Text>
          </Center>
        )}

        {previewData && !carDataList.find(c => c.nome === previewData.nome) && (
          <>
            <Text mb={3} fontWeight="bold" fontSize="lg" color={colors.textPrimary}>
              Preview:
            </Text>
            <CarCard
              carData={previewData}
              onPress={() => openCarModal(previewData)}
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDeleteCar}
              bgColor={colors.card}
            />
          </>
        )}

        {carDataList.length > 0 && (
          <>
            {carDataList.map(car => (
              <CarCard
                key={car.id ?? car.nome}
                carData={car}
                onPress={() => openCarModal(car)}
                isFavorited={isFavorited}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeleteCar}
                bgColor={colors.card}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* MODAL DETALHES DO CARRO */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="full">
        <Modal.Content bg={colors.card} maxW="90%" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header bg={colors.accent} borderTopRadius="2xl">
            <Text color="white" fontWeight="bold" fontSize="lg">
              {selectedCar?.nome}
            </Text>
          </Modal.Header>
          <Modal.Body>
            {selectedCar ? (
              <>
                <Image
                  source={{ uri: selectedCar.imagem }}
                  alt={selectedCar.nome}
                  width="100%"
                  height={250}
                  borderRadius="xl"
                  mb={4}
                  resizeMode="contain"
                />
                <Text fontSize="md" mb={2} color={colors.textPrimary}>
                  Modelo: {selectedCar.modelo ?? 'Desconhecido'}
                </Text>
                <Text fontSize="md" mb={2} color={colors.textPrimary}>
                  Ano: {selectedCar.ano ?? 'Desconhecido'}
                </Text>
              </>
            ) : (
              <Center>
                <Text color={colors.textSecondary}>Nenhum carro selecionado</Text>
              </Center>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* MODAL FAVORITOS */}
      <Modal isOpen={isFavoritesOpen} onClose={onFavoritesClose} size="full">
        <Modal.Content bg={colors.card} maxW="90%" borderRadius="2xl" minHeight="50%">
          <Modal.CloseButton />
          <Modal.Header bg={colors.accent} borderTopRadius="2xl">
            <Text color="white" fontWeight="bold" fontSize="lg">
              Favoritos
            </Text>
          </Modal.Header>
          <Modal.Body>
            {favorites.length === 0 ? (
              <Center>
                <Text color={colors.textSecondary}>Nenhum carro favoritado</Text>
              </Center>
            ) : (
              <ScrollView>
                <VStack space={3}>
                  {favorites.map(car => (
                    <CarCard
                      key={car.id ?? car.nome}
                      carData={car}
                      onPress={() => openCarModal(car)}
                      isFavorited={isFavorited}
                      onToggleFavorite={toggleFavorite}
                      onDelete={handleDeleteCar}
                      bgColor={colors.card}
                    />
                  ))}
                </VStack>
              </ScrollView>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
}
