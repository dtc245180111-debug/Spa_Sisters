// =========================================================
// QUẢN LÝ MODAL POPUP ĐẶT LỊCH HẸN
// =========================================================

// Hàm mở Popup Đặt Lịch
function openBookingModal(serviceId = null) {
  const modal = document.getElementById('bookingModal');
  const serviceSelect = document.getElementById('bookServiceSelect');

  if (modal) {
    // Nếu có truyền ID dịch vụ thì tự động chọn dịch vụ đó trong dropdown
    if (serviceId && serviceSelect) {
      serviceSelect.value = serviceId;
    }
    
    // Thêm class 'active' và đổi display để hiển thị form
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

// Hàm đóng Popup Đặt Lịch
function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// =========================================================
// SỰ KIỆN KHI TRANG TẢI XONG (DOM CONTENT LOADED)
// =========================================================
document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('closeBookingBtn');
  const modal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');

  // Nút bấm X để đóng Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  // Bấm ra vùng đen bên ngoài Modal để đóng
  if (modal) {
    window.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Xử lý khi khách hàng ấn nút "XÁC NHẬN ĐẶT LỊCH"
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const service = document.getElementById('bookServiceSelect').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const name = document.getElementById('bookName').value;
      const phone = document.getElementById('bookPhone').value;

      // Thông báo xác nhận đăng ký thành công
      alert(`Cảm ơn quý khách ${name}!\n\nĐặt lịch thành công cho dịch vụ: ${service}\nThời gian: ${time} ngày ${date}\nHotline tư vấn sẽ liên hệ SĐT: ${phone} để xác nhận.`);

      // Xóa dữ liệu trong form và đóng popup
      bookingForm.reset();
      closeBookingModal();
    });
  }
  /* ==========================================================================
   Plumeria Spa by Royal - Core Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language State & i18n Dictionary
  let currentLanguage = 'vi';

  const i18n = {
    vi: {
      navAbout: 'Về Chúng Tôi',
      navServices: 'Dịch Vụ',
      navAI: 'Tư Vấn AI',
      navPromos: 'Ưu Đãi',
      navContact: 'Liên Hệ',
      navBookBtn: 'Đặt Lịch',
      heroSubtitle: 'Plumeria Spa by Royal',
      heroTitle: 'VẺ ĐẸP THĂNG HOA - SỨC KHỎE VẸN TOÀN',
      heroDesc: 'Tận hưởng khoảnh khắc thư thái đỉnh cao trong không gian kiến trúc hoàng gia kết hợp với công nghệ chăm sóc & tư vấn AI hiện đại.',
      heroBtnBook: 'Đặt Lịch Ngay',
      heroBtnAI: 'Tư Vấn AI 24/7',
      aboutTitle: 'Tinh Hoa Spa <span>Hoàng Gia & Hiện Đại</span>',
      aboutDesc: 'Plumeria Spa by Royal mang đến liệu pháp chăm sóc sức khỏe và sắc đẹp độc bản, kết hợp thảo mộc thiên nhiên quý hiếm cùng công nghệ AI hỗ trợ phân tích làn da và sức khỏe cá nhân hóa.',
      aiSectionTitle: 'Trợ Lý AI <span>Tư Vấn Thư Giãn</span>',
      aiSectionDesc: 'Chọn các nhu cầu của bạn bên dưới để Trợ lý AI Plumeria phân tích và gợi ý liệu trình tối ưu nhất cho riêng bạn.',
      servicesTitle: 'Danh Mục <span>Dịch Vụ Đẳng Cấp</span>',
      filterAll: 'Tất Cả',
      filterMassage: 'Massage Trị Liệu',
      filterFacial: 'Chăm Sóc Da Mặt',
      filterBody: 'Tắm & Ủ Thảo Dược',
      filterVip: 'Gói Hoàng Gia VIP',
      bookModalTitle: 'Đặt Lịch Trải Nghiệm Spa',
      bookModalSub: 'Vui lòng điền thông tin để Plumeria Spa chuẩn bị đón tiếp quý khách chu đáo nhất.',
      modalStep1: '1. Chọn Dịch Vụ',
      modalStep2: '2. Ngày & Giờ',
      modalStep3: '3. Thông Tin Khách Hàng',
      confirmTitle: 'Xác Nhận Đặt Lịch Thành Công!',
      confirmSub: 'Cảm ơn quý khách đã tin tưởng Plumeria Spa by Royal.',
      btnApplyAI: 'Đặt Lịch Theo Gợi Ý AI',
      btnConfirmBook: 'Xác Nhận Đặt Lịch'
    },
    en: {
      navAbout: 'About Us',
      navServices: 'Services',
      navAI: 'AI Concierge',
      navPromos: 'Offers',
      navContact: 'Contact',
      navBookBtn: 'Book Now',
      heroSubtitle: 'Plumeria Spa by Royal',
      heroTitle: 'ELEVATED BEAUTY - COMPLETE WELLNESS',
      heroDesc: 'Immerse in ultimate relaxation within a luxurious royal setting, enhanced by modern AI skincare & wellness consultations.',
      heroBtnBook: 'Reserve Now',
      heroBtnAI: '24/7 AI Consult',
      aboutTitle: 'The Imperial Essence of <span>Royal Wellness</span>',
      aboutDesc: 'Plumeria Spa by Royal provides bespoke beauty therapies, blending rare natural botanicals with intelligent AI diagnostics for tailored health and glow.',
      aiSectionTitle: 'Smart AI <span>Wellness Concierge</span>',
      aiSectionDesc: 'Select your personal targets below for Plumeria AI to analyze and generate your ideal luxury spa treatment.',
      servicesTitle: 'Signature <span>Spa Treatments</span>',
      filterAll: 'All',
      filterMassage: 'Body Therapy',
      filterFacial: 'Facial Care',
      filterBody: 'Body Polish',
      filterVip: 'Royal VIP',
      bookModalTitle: 'Reserve Your Spa Experience',
      bookModalSub: 'Please fill in your reservation details for VIP reception preparation.',
      modalStep1: '1. Select Service',
      modalStep2: '2. Date & Time',
      modalStep3: '3. Personal Details',
      confirmTitle: 'Reservation Confirmed!',
      confirmSub: 'Thank you for choosing Plumeria Spa by Royal.',
      btnApplyAI: 'Book Recommended Service',
      btnConfirmBook: 'Confirm Reservation'
    }
  };

  // 2. Header Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Language Switcher Trigger
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      currentLanguage = lang;
      window.plumeriaAI.setLang(lang);
      updateUILanguage(lang);
      updateAIRecommendationDisplay();
    });
  });

  function updateUILanguage(lang) {
    const dict = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  }

  // 4. AI Quiz Chips Selection
  const quizChips = document.querySelectorAll('.quiz-chip');
  quizChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const concern = chip.getAttribute('data-concern');
      window.plumeriaAI.toggleConcern(concern);
      updateAIRecommendationDisplay();
    });
  });

  function updateAIRecommendationDisplay() {
    const result = window.plumeriaAI.analyzeRecommendation();
    const resultBox = document.getElementById('aiResultBox');
    if (resultBox) {
      resultBox.innerHTML = `
        <div>
          <div class="ai-result-header">
            <div class="ai-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div>
              <h4 style="color: var(--accent-gold-light); font-size: 1.1rem;">Plumeria AI Specialist</h4>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${currentLanguage === 'vi' ? 'Kết quả phân tích cá nhân' : 'Personalized AI Analysis'}</span>
            </div>
          </div>
          <div class="ai-result-content">
            <p>${result.aiAdvice}</p>
            <div class="ai-recommended-pkg">
              <div class="ai-pkg-title">${result.title}</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${result.desc}</p>
              <div class="ai-pkg-meta">
                <span>⏱️ ${result.duration}</span>
                <span>💎 ${result.price}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <button class="btn btn-gold" style="width: 100%; font-size: 0.85rem;" onclick="applyAIRecommendation('${result.treatment.id}')">
            ${currentLanguage === 'vi' ? 'ĐẶT LỊCH THEO GỢI Ý AI' : 'BOOK RECOMMENDED SERVICE'}
          </button>
        </div>
      `;
    }
  }

  window.applyAIRecommendation = function (treatmentId) {
    openBookingModal(treatmentId);
  };

  // 5. Service Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Booking Modal Operations
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingBtn = document.getElementById('closeBookingBtn');
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('bookServiceSelect');

  window.openBookingModal = function (presetServiceId = null) {
    if (bookingModal) {
      bookingModal.classList.add('open');
      if (presetServiceId && serviceSelect) {
        serviceSelect.value = presetServiceId;
      }
    }
  };

  if (closeBookingBtn) {
    closeBookingBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('open');
      }
    });
  }

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('bookName').value || 'Quý Khách';
      const clientPhone = document.getElementById('bookPhone').value || '0901234567';
      const bookDate = document.getElementById('bookDate').value || new Date().toISOString().split('T')[0];
      const bookTime = document.getElementById('bookTime').value || '14:00';
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex].text;

      const randomBookingId = 'PLM-' + Math.floor(100000 + Math.random() * 900000);

      const confirmModalContent = document.getElementById('bookingModalCard');
      confirmModalContent.innerHTML = `
        <button class="modal-close-btn" onclick="document.getElementById('bookingModal').classList.remove('open')">✕</button>
        <div style="text-align: center; padding: 20px 0;">
          <div style="width: 64px; height: 64px; background: rgba(197, 160, 89, 0.2); border: 2px solid var(--accent-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--accent-gold-light); font-size: 1.8rem;">✓</div>
          <h3 style="font-size: 1.8rem; color: var(--accent-gold-light); margin-bottom: 8px;">${i18n[currentLanguage].confirmTitle}</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px;">${i18n[currentLanguage].confirmSub}</p>
          
          <div style="background: rgba(20, 10, 5, 0.8); border: 1px solid var(--border-gold); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--border-gold);">
              <span style="color: var(--text-muted);">Mã Đặt Lịch / Booking ID:</span>
              <strong style="color: var(--accent-gold-light); font-family: monospace; font-size: 1.1rem;">${randomBookingId}</strong>
            </div>
            <div style="margin-bottom: 8px;"><strong>Khách Hàng / Customer:</strong> ${clientName} (${clientPhone})</div>
            <div style="margin-bottom: 8px;"><strong>Dịch Vụ / Treatment:</strong> ${selectedOption}</div>
            <div style="margin-bottom: 8px;"><strong>Thời Gian / Date & Time:</strong> ${bookDate} - ${bookTime}</div>
            <div style="color: #4cd964; margin-top: 12px; font-size: 0.85rem;">★ Ưu đãi VIP 10% khi hoàn tất đặt qua AI Assistant</div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-gold" onclick="location.reload()">${currentLanguage === 'vi' ? 'Hoàn Tất' : 'Done'}</button>
          </div>
        </div>
      `;
    });
  }

  // 7. Floating AI Drawer Toggle
  const aiFabBtn = document.getElementById('aiFabBtn');
  const aiChatDrawer = document.getElementById('aiChatDrawer');
  const closeAiDrawerBtn = document.getElementById('closeAiDrawerBtn');
  const aiChatInput = document.getElementById('aiChatInput');
  const sendAiChatBtn = document.getElementById('sendAiChatBtn');
  const aiChatMessages = document.getElementById('aiChatMessages');

  if (aiFabBtn && aiChatDrawer) {
    aiFabBtn.addEventListener('click', () => {
      aiChatDrawer.classList.toggle('open');
    });
  }

  if (closeAiDrawerBtn) {
    closeAiDrawerBtn.addEventListener('click', () => {
      aiChatDrawer.classList.remove('open');
    });
  }

  function sendChatMessage() {
    const text = aiChatInput.value.trim();
    if (!text) return;

    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.textContent = text;
    aiChatMessages.appendChild(userDiv);
    aiChatInput.value = '';

    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    // Simulate AI Response
    setTimeout(() => {
      const responseText = window.plumeriaAI.generateChatResponse(text);
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.textContent = responseText;
      aiChatMessages.appendChild(botDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }, 600);
  }

  if (sendAiChatBtn) {
    sendAiChatBtn.addEventListener('click', sendChatMessage);
  }

  if (aiChatInput) {
    aiChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Initialize Default AI Display
  updateAIRecommendationDisplay();
});
});