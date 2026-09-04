/* ==========================================================================
   Plumeria AI Wellness Concierge - Smart Recommendation Engine
   ========================================================================== */

const SPA_AI_KNOWLEDGE = {
  treatments: [
    {
      id: 'hot-stone-royal',
      nameVi: 'Trị Liệu Đá Nóng Hoàng Gia',
      nameEn: 'Royal Hot Stone & Aromatherapy',
      duration: '90 phút / mins',
      price: '1.200.000 VNĐ',
      priceNum: 1200000,
      tags: ['stress', 'muscle', 'sleep', 'body'],
      recommendedOilVi: 'Tinh dầu Lavender & Gỗ Đàn Hương',
      recommendedOilEn: 'Lavender & Sandalwood Essential Oil',
      descVi: 'Sử dụng đá núi lửa nóng kết hợp tinh dầu thảo dược giúp lưu thông khí huyết, giải tỏa căng thẳng toàn thân.',
      descEn: 'Combines heated volcanic basalt stones with organic botanical oils to release deep muscle tension.'
    },
    {
      id: 'gold-facial-rejuvenation',
      nameVi: 'Liệu Trình Tái Tạo Da Mặt Vàng 24K',
      nameEn: '24K Gold Leaf Facial Rejuvenation',
      duration: '75 phút / mins',
      price: '1.500.000 VNĐ',
      priceNum: 1500000,
      tags: ['aging', 'facial', 'glow', 'sensitive'],
      recommendedOilVi: 'Tinh chất Hoa Hồng Thổ Nhĩ Kỳ & Vàng Lá 24K',
      recommendedOilEn: 'Turkish Rose Serum & 24K Gold Foil',
      descVi: 'Phục hồi nếp nhăn, tăng sinh collagen và dưỡng da sáng mịn bằng lá vàng 24K nguyên chất.',
      descEn: 'Anti-aging luxury ritual infused with 24K pure gold leaf to boost collagen and radiant skin glow.'
    },
    {
      id: 'herbal-detox-soak',
      nameVi: 'Tắm Thảo Dược Hoàng Cung & Ủ Dưỡng',
      nameEn: 'Imperial Herbal Bath & Body Wrap',
      duration: '60 phút / mins',
      price: '850.000 VNĐ',
      priceNum: 850000,
      tags: ['detox', 'skin-soft', 'body'],
      recommendedOilVi: 'Hoa Lài & Thảo Dược Đông Y',
      recommendedOilEn: 'Jasmine Blossoms & Oriental Herbs',
      descVi: 'Ngâm bồn bách thảo và ủ dưỡng toàn thân với tinh chất hoa nhài, trà xanh bách nhật.',
      descEn: 'Detoxifying herbal bath followed by deep skin hydration and floral body polish.'
    },
    {
      id: 'deep-tissue-bamboo',
      nameVi: 'Massage Tre Thảo Dược Trị Liệu Vai Gáy',
      nameEn: 'Deep Tissue Bamboo Neck & Back Relief',
      duration: '90 phút / mins',
      price: '1.100.000 VNĐ',
      priceNum: 1100000,
      tags: ['muscle', 'neck-pain', 'stress'],
      recommendedOilVi: 'Tinh dầu Gừng Ấm & Bạch Đàn',
      recommendedOilEn: 'Warming Ginger & Eucalyptus Essential Oil',
      descVi: 'Tác động sâu vào các bó cơ vai gáy bị co thắt bằng gậy tre ấm và kỹ thuật miết huyệt.',
      descEn: 'Targeted pressure therapy using heated bamboo rods to melt office fatigue and neck tension.'
    }
  ],

  faqs: {
    vi: [
      { key: 'booking', response: 'Bạn có thể nhấn nút "ĐẶT LỊCH NGAY" hoặc chọn bất kỳ gợi ý nào từ AI để mở form đặt phòng ưu tiên với mã giảm 10%!' },
      { key: 'price', response: 'Giá dịch vụ tại Plumeria Spa dao động từ 650.000 VNĐ đến 2.500.000 VNĐ tùy theo liệu trình và dịch vụ VIP.' },
      { key: 'hours', response: 'Plumeria Spa mở cửa hàng ngày từ 09:00 sáng đến 22:00 tối (nhận ca cuối lúc 20:30).' }
    ],
    en: [
      { key: 'booking', response: 'You can click "BOOK NOW" or apply AI recommendations directly to our online reservation system with 10% VIP discount!' },
      { key: 'price', response: 'Plumeria Spa services range from 650,000 VND to 2,500,000 VND depending on the package duration and VIP upgrades.' },
      { key: 'hours', response: 'We are open daily from 09:00 AM to 10:00 PM (Last booking accepted at 08:30 PM).' }
    ]
  }
};

class PlumeriaAIConcierge {
  constructor() {
    this.selectedConcerns = [];
    this.selectedTime = '90';
    this.selectedSkinType = 'normal';
    this.currentLang = 'vi';
  }

  setLang(lang) {
    this.currentLang = lang;
  }

  toggleConcern(concernId) {
    const idx = this.selectedConcerns.indexOf(concernId);
    if (idx > -1) {
      this.selectedConcerns.splice(idx, 1);
    } else {
      this.selectedConcerns.push(concernId);
    }
  }

  analyzeRecommendation() {
    let matchedTreatment = SPA_AI_KNOWLEDGE.treatments[0];
    let maxScore = -1;

    SPA_AI_KNOWLEDGE.treatments.forEach(t => {
      let score = 0;
      this.selectedConcerns.forEach(c => {
        if (t.tags.includes(c)) score += 2;
      });
      if (score > maxScore) {
        maxScore = score;
        matchedTreatment = t;
      }
    });

    const isVi = this.currentLang === 'vi';

    return {
      treatment: matchedTreatment,
      title: isVi ? matchedTreatment.nameVi : matchedTreatment.nameEn,
      desc: isVi ? matchedTreatment.descVi : matchedTreatment.descEn,
      duration: matchedTreatment.duration,
      price: matchedTreatment.price,
      oil: isVi ? matchedTreatment.recommendedOilVi : matchedTreatment.recommendedOilEn,
      aiAdvice: isVi
        ? `Dựa trên phân tích nhu cầu của bạn (${this.selectedConcerns.join(', ') || 'thư giãn tổng thể'}), chuyên gia AI khuyến nghị liệu trình **${matchedTreatment.nameVi}** kết hợp với **${matchedTreatment.recommendedOilVi}** để đạt hiệu quả giải tỏa mệt mỏi và phục hồi làn da tối ưu nhất.`
        : `Based on your selected profile (${this.selectedConcerns.join(', ') || 'general wellness'}), Plumeria AI recommends the **${matchedTreatment.nameEn}** using **${matchedTreatment.recommendedOilEn}** for optimum stress recovery and skin radiance.`
    };
  }

  generateChatResponse(userMessage) {
    const msgLower = userMessage.toLowerCase();
    const isVi = this.currentLang === 'vi';

    if (msgLower.includes('đặt lịch') || msgLower.includes('book') || msgLower.includes('hẹn')) {
      return isVi
        ? 'Dạ, tôi có thể hỗ trợ bạn chọn lịch đặt phù hợp ngay bây giờ. Bạn muốn đi vào hôm nay hay cuối tuần này ạ?'
        : 'I can certainly help arrange your spa reservation right now. Would you prefer today or this weekend?';
    }

    if (msgLower.includes('mặt') || msgLower.includes('facial') || msgLower.includes('da')) {
      return isVi
        ? 'Đối với chăm sóc da mặt, Plumeria Spa nổi tiếng với Liệu Trình Tái Tạo Da Mặt Vàng 24K giúp sáng da và nâng cơ rất hiệu quả.'
        : 'For facial care, Plumeria Spa recommends our signature 24K Gold Leaf Facial Rejuvenation for intense hydration and glow.';
    }

    if (msgLower.includes('đau') || msgLower.includes('mỏi') || msgLower.includes('neck') || msgLower.includes('pain') || msgLower.includes('massage')) {
      return isVi
        ? 'Nếu bạn bị đau mỏi vai gáy hoặc lưng, liệu trình Massage Tre Thảo Dược hoặc Đá Nóng Hoàng Gia sẽ giải tỏa ngay tức thì các vùng cơ bị căng cứng.'
        : 'If you experience back or neck tension, our Heated Bamboo & Royal Hot Stone therapy provides immediate targeted relief.';
    }

    return isVi
      ? `Cảm ơn bạn đã hỏi! Là trợ lý tư vấn spa Plumeria, tôi khuyên bạn nên thử bộ giải pháp thư giãn chuyên sâu kết hợp tinh dầu lavender hữu cơ. Bạn có muốn mở bảng chẩn đoán da & cơ thể trực tiếp không?`
      : `Thank you for reaching out! As Plumeria's AI Concierge, I suggest trying our holistic spa package with organic lavender oils. Would you like to run a custom skin & body diagnostic scan?`;
  }
}

window.plumeriaAI = new PlumeriaAIConcierge();

