import React from 'react';
import './News.css';

const News: React.FC = () => {
    return (
        <div className="news-page">
            {/* Hero Section */}
            <section className="news-hero">
                <div className="hero-content">
                    <h1 className="fade-in-up">Tin Tức & Sự Kiện</h1>
                    <p className="fade-in-up delay-1">Cập nhật những thông tin mới nhất về nghệ thuật, triển lãm và sự kiện</p>
                </div>
            </section>

            {/* News Content */}
            <section className="news-content">
                <div className="container" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    {/* Featured News */}
                    <div className="featured-news fade-in">
                        <div className="featured-image">
                            {/* Assuming images are copied to public or accessible. Using placeholder if not */}
                            <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Triển lãm tranh" />
                            <div className="featured-overlay">
                                <span className="featured-badge">NỔI BẬT</span>
                            </div>
                        </div>
                        <div className="featured-info">
                            <span className="news-date">
                                <i className="ti-calendar"></i> 15/01/2025
                            </span>
                            <h2>Triển lãm tranh "Cảm Từ Cầu" - Họa sĩ Lân Vũ</h2>
                            <p>Triển lãm tranh đặc biệt của họa sĩ Lân Vũ với chủ đề "Cảm Từ Cầu" sẽ được tổ chức tại LanVu Gallery từ ngày 20/01 đến 28/01/2025. Đây là cơ hội để người yêu nghệ thuật chiêm ngưỡng những tác phẩm độc đáo...</p>
                            <a href="#" className="read-more-btn">
                                Đọc thêm <i className="ti-arrow-right"></i>
                            </a>
                        </div>
                    </div>

                    {/* News Grid */}
                    <div className="news-grid">
                        <article className="news-card fade-in">
                            <div className="news-card-image">
                                <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Đề bàn" />
                                <div className="news-card-overlay">
                                    <a href="#" className="view-btn"><i className="ti-eye"></i></a>
                                </div>
                            </div>
                            <div className="news-card-content">
                                <span className="news-category">Triển lãm</span>
                                <span className="news-date">
                                    <i className="ti-calendar"></i> 10/01/2025
                                </span>
                                <h3>Triển lãm "Đề Bàn" - Nghệ thuật đương đại</h3>
                                <p>Khám phá những tác phẩm nghệ thuật đương đại độc đáo trong triển lãm "Đề Bàn" tại LanVu Gallery...</p>
                                <a href="#" className="read-more">Đọc thêm →</a>
                            </div>
                        </article>

                        <article className="news-card fade-in">
                            <div className="news-card-image">
                                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ngắm sen" />
                                <div className="news-card-overlay">
                                    <a href="#" className="view-btn"><i className="ti-eye"></i></a>
                                </div>
                            </div>
                            <div className="news-card-content">
                                <span className="news-category">Nghệ thuật</span>
                                <span className="news-date">
                                    <i className="ti-calendar"></i> 05/01/2025
                                </span>
                                <h3>Workshop "Ngắm Sen" - Học vẽ tranh sơn dầu</h3>
                                <p>Tham gia workshop học vẽ tranh sơn dầu với chủ đề hoa sen, được hướng dẫn bởi các họa sĩ chuyên nghiệp...</p>
                                <a href="#" className="read-more">Đọc thêm →</a>
                            </div>
                        </article>

                        <article className="news-card fade-in">
                            <div className="news-card-image">
                                <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Phòng ngủ" />
                                <div className="news-card-overlay">
                                    <a href="#" className="view-btn"><i className="ti-eye"></i></a>
                                </div>
                            </div>
                            <div className="news-card-content">
                                <span className="news-category">Tư vấn</span>
                                <span className="news-date">
                                    <i className="ti-calendar"></i> 01/01/2025
                                </span>
                                <h3>Bí quyết chọn tranh trang trí phòng ngủ</h3>
                                <p>Hướng dẫn chi tiết cách chọn tranh phù hợp với không gian phòng ngủ để tạo cảm giác thư giãn và ấm cúng...</p>
                                <a href="#" className="read-more">Đọc thêm →</a>
                            </div>
                        </article>
                        
                        <article className="news-card fade-in">
                            <div className="news-card-image">
                                <img src="https://images.unsplash.com/photo-1577083165243-d731db87fed6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sự kiện" />
                                <div className="news-card-overlay">
                                    <a href="#" className="view-btn"><i className="ti-eye"></i></a>
                                </div>
                            </div>
                            <div className="news-card-content">
                                <span className="news-category">Sự kiện</span>
                                <span className="news-date">
                                    <i className="ti-calendar"></i> 28/12/2024
                                </span>
                                <h3>Khai trương chi nhánh mới tại TP.HCM</h3>
                                <p>LanVu Gallery vui mừng thông báo khai trương chi nhánh mới tại quận 1, TP.HCM với nhiều ưu đãi đặc biệt...</p>
                                <a href="#" className="read-more">Đọc thêm →</a>
                            </div>
                        </article>
                    </div>

                    {/* Pagination */}
                    <div className="pagination fade-in">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <button className="page-btn">
                            <i className="ti-angle-right">{'>'}</i>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default News;
