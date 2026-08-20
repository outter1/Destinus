import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

// Fallback usado só se o usuário negar a permissão de localização ou se o
// GPS não estiver disponível (ex.: emulador sem sensor configurado) — assim
// o app continua funcionando mesmo sem acesso ao GPS, em vez de travar.
const FALLBACK_LOCATION: UserLocation = {
  latitude: -22.7856,
  longitude: -43.3117,
  city: "Duque de Caxias - RJ",
};

/**
 * Pede permissão de localização e retorna a posição atual do dispositivo,
 * para que a busca de locais reconheça de fato onde o usuário está, em vez
 * de sempre buscar ao redor de Duque de Caxias.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>(FALLBACK_LOCATION);
  const [status, setStatus] = useState<LocationStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      try {
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

        if (permissionStatus !== "granted") {
          if (isMounted) setStatus("denied");
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        let city: string | undefined;
        try {
          // Web não tem reverse geocode nativo no expo-location; nesse caso
          // seguimos só com as coordenadas (o backend não depende do nome
          // da cidade para buscar os locais próximos).
          if (Platform.OS !== "web") {
            const [place] = await Location.reverseGeocodeAsync({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            city = place?.city || place?.subregion || place?.region || undefined;
          }
        } catch {
          // Falha no reverse geocode não deve impedir o uso das coordenadas.
        }

        if (isMounted) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city,
          });
          setStatus("granted");
        }
      } catch {
        if (isMounted) setStatus("unavailable");
      }
    }

    loadLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  return { location, status, usingFallback: status !== "granted" };
}
