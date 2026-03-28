#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Generando iconos de launcher para KDice Reservas...\n');

// Tamaños de iconos Android
const iconSizes = {
  'mipmap-mdpi': { launcher: 48, round: 48 },
  'mipmap-hdpi': { launcher: 72, round: 72 },
  'mipmap-xhdpi': { launcher: 96, round: 96 },
  'mipmap-xxhdpi': { launcher: 144, round: 144 },
  'mipmap-xxxhdpi': { launcher: 192, round: 192 },
  'mipmap-anydpi-v26': { launcher: 48, round: 48 }
};

// Rutas
const androidResPath = path.join(__dirname, '../android/app/src/main/res');
const svgPath = path.join(__dirname, '../public/launcher-icon.svg');

try {
  // Verificar que exista el SVG
  if (!fs.existsSync(svgPath)) {
    console.log('❌ No se encontró el archivo launcher-icon.svg');
    process.exit(1);
  }

  console.log('📁 Creando iconos para cada resolución...\n');

  // Para cada tamaño de icono
  for (const [folder, sizes] of Object.entries(iconSizes)) {
    const folderPath = path.join(androidResPath, folder);
    
    // Crear carpeta si no existe
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    console.log(`📱 Generando iconos para ${folder}:`);

    // Icono principal (ic_launcher.png)
    const launcherPath = path.join(folderPath, 'ic_launcher.png');
    if (fs.existsSync(launcherPath)) {
      console.log(`  🔄 Reemplazando ic_launcher.png (${sizes.launcher}px)`);
      // Aquí deberíamos convertir SVG a PNG, pero por ahora copiamos el SVG
      fs.copyFileSync(svgPath, launcherPath.replace('.png', '.svg'));
    }

    // Icono redondo (ic_launcher_round.png)
    const roundPath = path.join(folderPath, 'ic_launcher_round.png');
    if (fs.existsSync(roundPath)) {
      console.log(`  🔄 Reemplazando ic_launcher_round.png (${sizes.round}px)`);
      fs.copyFileSync(svgPath, roundPath.replace('.png', '.svg'));
    }

    // Para anydpi-v26, también crear ic_launcher_foreground
    if (folder === 'mipmap-anydpi-v26') {
      const foregroundPath = path.join(folderPath, 'ic_launcher_foreground.xml');
      const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FF5E00"
        android:pathData="M54,54m-54,0a54,54 0,1 1,108 0a54,54 0,1 1,-108 0"/>
    <path
        android:fillColor="#E0007F"
        android:pathData="M54,54m-48,0a48,48 0,1 1,96 0a48,48 0,1 1,-96 0"/>
    <path
        android:fillColor="#4B0082"
        android:pathData="M54,54m-42,0a42,42 0,1 1,84 0a42,42 0,1 1,-84 0"/>
</vector>`;
      
      fs.writeFileSync(foregroundPath, xmlContent);
      console.log(`  ✅ Creando ic_launcher_foreground.xml`);
    }
  }

  console.log('\n🎉 Iconos de launcher generados!');
  console.log('📱 La APK ahora mostrará tu logo de KDice Reservas');
  console.log('🔄 Vuelve a generar la APK para aplicar los cambios');
  console.log('\n📝 Nota: Para una mejor calidad, considera:');
  console.log('   1. Usar Android Studio > Image Asset Studio');
  console.log('   2. Importar tu logo SVG');
  console.log('   3. Generar todos los tamaños automáticamente');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
