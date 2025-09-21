export function pastelColor(index: number): string {
  // Genera una sequenza di colori ben distanziati usando l'angolo aureo
  const golden = 137.508; // gradi
  const hue = (index * golden) % 360;
  const sat = 68; // saturazione medio-alta (leggibile su nero)
  const light = 68; // luminosità pastello
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

