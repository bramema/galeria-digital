// 1. Configuración de credenciales
const SUPABASE_URL = 'https://rkoplrwxqkhkkmfqkvev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r8YxKSCQo7L-LFIu-ck6lw_baWB5CY4';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarFotos() {
  const container = document.getElementById('galleryContainer') || document.querySelector('.gallery');

  try {
    // Consulta a la tabla 'fotos1'
    const { data: fotos, error } = await supabaseClient
      .from('fotos1')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!fotos || fotos.length === 0) {
      container.innerHTML = '<p style="text-align:center;">Aún no hay fotos en el álbum. ¡Sé el primero en subir una!</p>';
      return;
    }

    // Renderizar tarjetas de fotos
    container.innerHTML = fotos.map(foto => `
      <div class="photo-card">
        <img src="${foto.image_url}" alt="Foto de ${foto.author || 'Anónimo'}">
        <div class="photo-info">
          <p class="message">"${foto.message || ''}"</p>
          <p class="author">- ${foto.author || 'Anónimo'}</p>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error("Error al consultar Supabase:", err);
    document.getElementById('statusMessage')?.innerText || (container.innerHTML = '<p>Error al cargar las fotos.</p>');
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarFotos);