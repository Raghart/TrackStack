import { Button, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { IoMdWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const ErrorFallback = ({
  reset,
  minH = "100vh",
}: {
  reset: () => void;
  minH?: string | Record<string, string>;
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      data-testid="error-boundary-fallback"
      direction="column"
      align="center"
      justify="center"
      gap={4}
      w="full"
      minH={minH}
      px={4}
      py={10}
      textAlign="center"
      userSelect="none"
    >
      <Icon as={IoMdWarning} color="yellow.500" boxSize={{ base: 12, md: 16 }} />
      <Heading
        fontFamily="'Barlow', sans-serif"
        fontWeight="600"
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
      >
        Algo salió mal
      </Heading>
      <Text maxW="md" color="whiteAlpha.800">
        Se produjo un error inesperado al mostrar esta sección. Puedes intentarlo de nuevo o volver al inicio.
      </Text>
      <Stack direction={{ base: "column", sm: "row" }} gap={3} mt={2}>
        <Button data-testid="error-boundary-retry" onClick={reset} colorPalette="teal">
          Reintentar
        </Button>
        <Button
          data-testid="error-boundary-home"
          onClick={() => {
            reset();
            navigate("/");
          }}
          variant="outline"
        >
          Volver al inicio
        </Button>
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </Stack>
    </Flex>
  );
};