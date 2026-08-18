import { Alert, Platform } from "react-native";

// O Alert.alert do React Native não funciona de forma confiável rodando no
// navegador (expo start --web / react-native-web): em várias versões ele
// simplesmente não exibe nada, e quando tem múltiplos botões (como o
// "Cancelar Reserva") o botão de confirmação nunca chama o onPress. Por
// isso mensagens de sucesso/erro "sumiam" e o cancelamento não fazia nada
// quando testado no navegador.
//
// notify()  -> mensagem simples (equivalente a Alert.alert(titulo, msg))
// confirmAsync() -> pergunta sim/não, devolve true/false

export function notify(title: string, message?: string) {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export function confirmAsync(title: string, message?: string): Promise<boolean> {
  if (Platform.OS === "web") {
    const result = window.confirm(message ? `${title}\n\n${message}` : title);
    return Promise.resolve(result);
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "Não", style: "cancel", onPress: () => resolve(false) },
      { text: "Sim", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
