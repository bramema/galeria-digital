// 1. Configuración de credenciales de Supabase
const SUPABASE_URL = 'https://rkoplrwxqkhkkmfqkvev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r8YxKSCQo7L-LFIu-ck6lw_baWB5CY4'; // Clave pública anon

// 2. Inicialización del cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadPhoto() {
  const author = document.getElementById('author').value.trim();
  const message = document.getElementById('message').value.trim();
  const fileInput = document.getElementById('fileInput');
  const status = document.getElementById('statusMessage');
  const uploadBtn = document.getElementById('uploadBtn');

  if (fileInput.files.length === 0) {
    status.style.color = "red";
    status.innerText = "Por favor selecciona una foto.";
    return;
  }

  const rawFile = fileInput.files[0];
  uploadBtn.disabled = true;
  status.style.color = "#ff4b72";
  status.innerText = "Optimizando foto...";

  try {
    // Opciones para comprimir la foto con browser-image-compression
    const options = {
      maxSizeMB: 0.5,           // Máximo 500 KB por foto
      maxWidthOrHeight: 1200,   // Dimensión máxima
      useWebWorker: true
    };

    const file = await imageCompression(rawFile, options);
    status.innerText = "Subiendo al álbum...";

    const fileName = `${Date.now()}_${file.name}`;

    // A. Subir imagen a Supabase Storage
    const { data: storageData, error: storageError } = await supabaseClient.storage
      .from('fotos-album')
      .upload(fileName, file);

    if (storageError) throw storageError;

    // B. Obtener URL pública de la imagen
    const { data: urlData } = supabaseClient.storage
      .from('fotos-album')
      .getPublicUrl(fileName);

    const photoUrl = urlData.publicUrl;

    // C. Guardar registro en la base de datos
    const { error: dbError } = await supabaseClient
      .from('fotos1')
      .insert([
        { 
          image_url: photoUrl, 
          author: author, 
          message: message 
        }
      ]);

    if (dbError) throw dbError;

    status.style.color = "green";
    status.innerText = "¡Foto subida con éxito! Redirigiendo...";

    // Redirección corregida a la carpeta html
    setTimeout(() => {
        window.location.href = "html/FOTOS.html";
      }, 1500);

  } catch (err) {
    console.error("Error en el proceso:", err);
    status.style.color = "red";
    status.innerText = "Ocurrió un error al subir la foto.";
  } finally {
    uploadBtn.disabled = false;
  }
}