import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

/**
 * Guarda archivo en dispositivo (para APK)
 * o descarga normal (para web)
 */
export async function saveFile({ filename, data, contentType, blob }) {
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    try {
      // Convertir Blob a Base64 para Capacitor
      let base64Data;
      if (blob) {
        base64Data = await blobToBase64(blob);
      } else if (typeof data === 'string') {
        base64Data = btoa(unescape(encodeURIComponent(data)));
      } else {
        base64Data = data;
      }

      // Guardar archivo en Downloads
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });

      // Compartir archivo
      await Share.share({
        title: filename,
        url: result.uri,
        dialogTitle: 'Guardar archivo',
      });

      return { success: true, uri: result.uri };
    } catch (error) {
      console.error('Error guardando archivo:', error);
      throw error;
    }
  } else {
    // Web: descarga normal
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // Para datos string
      const blob = new Blob([data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    return { success: true };
  }
}

/**
 * Convierte Blob a Base64
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Guarda PDF desde jsPDF
 */
export async function savePDF(doc, filename) {
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    // En APK, obtenemos el PDF como base64
    const pdfData = doc.output('datauristring');
    const base64 = pdfData.split(',')[1];
    
    await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });

    // Compartir
    const fileInfo = await Filesystem.getUri({
      path: filename,
      directory: Directory.Documents,
    });

    await Share.share({
      title: filename,
      url: fileInfo.uri,
      dialogTitle: 'Guardar PDF',
    });
  } else {
    // Web: descarga normal
    doc.save(filename);
  }
}

/**
 * Guarda Excel desde XLSX
 */
export async function saveExcel(wb, filename) {
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    // Generar Excel como array buffer
    const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelData], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const base64 = await blobToBase64(blob);
    
    await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });

    // Compartir
    const fileInfo = await Filesystem.getUri({
      path: filename,
      directory: Directory.Documents,
    });

    await Share.share({
      title: filename,
      url: fileInfo.uri,
      dialogTitle: 'Guardar Excel',
    });
  } else {
    // Web: descarga normal
    XLSX.writeFile(wb, filename);
  }
}
