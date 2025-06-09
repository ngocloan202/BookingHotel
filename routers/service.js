const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Service = require('../models/service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ trangThai: 'Hoạt động' }).lean();
    
    const processedServices = services.map(service => ({
      _id: service._id,
      tenDichVu: service.tenDichVu,
      gia: service.donGia,
      hinhAnh: service.hinhAnh || 'default-service.jpg',
      thoiGianPhucVu: service.thoiGianPhucVu,
      moTa: `Dịch vụ ${service.tenDichVu} chất lượng cao với thời gian phục vụ ${service.thoiGianPhucVu}` // Tạo mô tả động
    }));

    res.render('service', { 
      services: processedServices,
      title: 'Dịch vụ khách sạn'
    });
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    res.render('service', { 
      services: [],
      title: 'Dịch vụ khách sạn',
      error: 'Không thể tải danh sách dịch vụ'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).render('service_detail', { 
        service: null, 
        error: 'ID dịch vụ không hợp lệ' 
      });
    }
    
    const service = await Service.findById(serviceId).lean();
    
    if (!service) {
      return res.status(404).render('service_detail', { 
        service: null, 
        error: 'Không tìm thấy dịch vụ' 
      });
    }
    
    const processedService = {
      ...service,
      gia: service.donGia,
      hinhAnh: service.hinhAnh || 'default-service.jpg',
      moTa: `Dịch vụ ${service.tenDichVu} chất lượng cao với thời gian phục vụ ${service.thoiGianPhucVu}. Chúng tôi cam kết mang đến trải nghiệm tuyệt vời nhất cho quý khách.`
    };
    
    res.render('service_detail', { service: processedService });
    
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết dịch vụ:', error);
    res.status(500).render('service_detail', { 
      service: null, 
      error: 'Lỗi server: ' + error.message 
    });
  }
});
module.exports = router;