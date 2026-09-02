// Credenciales de Supabase
const SUPABASE_URL = 'https://rkoplrwxqkhkkmfqkvev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r8YxKSCQo7L-LFIu-ck6lw_baWB5CY4';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarFotos() {
  const container = document.getElementById('galleryContainer') || document.querySelector('.gallery');

  try {
    // Consulta exacta a la tabla 'fotos1'
    const { data: fotos, error } = await supabaseClient
      .from('fotos1')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error devuelto por Supabase:", error);
      throw error;
    }

    if (!fotos || fotos.length === 0) {
      if (container) {
        container.innerHTML = '<p style="text-align:center;">Aún no hay fotos en el álbum.</p>';
      }
      return;
    }

    // Mapeo usando los nombres exactos de columnas
    if (container) {
      container.innerHTML = fotos.map(foto => `
        <div class="photo-card">
          <img src="${foto.image_url}" alt="Foto de ${foto.author || 'Anónimo'}">
          <div class="photo-info">
            <p class="message">"${foto.message || ''}"</p>
            <p class="author">- ${foto.author || 'Anónimo'}</p>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    console.error("Detalle del error al cargar:", err);
    if (container) {
      container.innerHTML = `<p style="color:red; text-align:center;">Error al cargar las fotos: ${err.message || 'Error desconocido'}</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', cargarFotos);