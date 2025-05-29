import React from 'react';
import { Box, Text, VStack } from 'native-base';

type Props = {
  carInfo: {
    Make_ID: number;
    Make_Name: string;
    Model_ID: number;
    Model_Name: string;
  } | null;
};

const CarInfo: React.FC<Props> = ({ carInfo }) => {
  if (!carInfo) {
    return (
      <Box padding={4} bg="gray.100" borderRadius="md">
        <Text color="gray.500" italic>
          Nenhuma informação técnica encontrada.
        </Text>
      </Box>
    );
  }

  return (
    <Box padding={4} bg="gray.50" borderRadius="md" shadow={1} marginTop={4}>
      <VStack space={2}>
        <Text fontWeight="bold" fontSize="md" color="black">
          Informações Técnicas
        </Text>
        <Text>Marca: {carInfo.Make_Name}</Text>
        <Text>Modelo: {carInfo.Model_Name}</Text>
        <Text>Make ID: {carInfo.Make_ID}</Text>
        <Text>Model ID: {carInfo.Model_ID}</Text>
      </VStack>
    </Box>
  );
};

export default CarInfo;
