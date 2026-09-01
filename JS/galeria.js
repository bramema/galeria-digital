const SUPABASE_URL = 'https://rkoplrwxqkhkkmfqkvev.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r8YxKSCQo7L-LFIu-ck6lw_baWB5CY4';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', loadPhotos);

async function loadPhotos() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Cargando recuerdos...</p>';

  try {
    const { data: fotos, error } = await supabaseClient
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    gallery.innerHTML = '';

    if (fotos.length === 0) {
      gallery.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aún no hay fotos subidas.</p>';
      return;
    }

    fotos.forEach(foto => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <img src="${foto.url}" alt="Recuerdo" loading="lazy">
        <div class="photo-info">
          <p class="message">"${foto.mensaje || 'Sin mensaje'}"</p>
          <p class="author">- ${foto.autor || 'Anónimo'}</p>
        </div>
      `;
      gallery.appendChild(card);
    });

  } catch (error) {
    console.error("Error al cargar fotos:", error);
    gallery.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Error al cargar las fotos.</p>';
  }
}