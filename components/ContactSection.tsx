'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactSectionProps {
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    weekday: string;
    weekend: string;
  };
}

export function ContactSection({
  location,
  address,
  phone,
  email,
  website,
  openingHours,
}: ContactSectionProps) {
  return (
    <section id="info" className="py-8 sm:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Thông Tin Liên Hệ
            </span>
          </h2>
          <p className="text-foreground/70 text-sm sm:text-lg">Liên hệ với chúng tôi để biết thêm chi tiết</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Location */}
          <Card className="border-border">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-lg">
                <span>📍</span>
                <span>Địa Điểm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
              <p className="text-sm sm:text-base font-semibold text-foreground">{location}</p>
              <p className="text-xs sm:text-sm text-foreground/70">{address}</p>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="border-border">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-lg">
                <span>📞</span>
                <span>Điện Thoại</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <a 
                href={`tel:${phone}`}
                className="text-primary font-semibold hover:text-primary/80 transition-colors text-sm sm:text-base"
              >
                {phone}
              </a>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border-border">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-lg">
                <span>📧</span>
                <span>Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <a 
                href={`mailto:${email}`}
                className="text-primary font-semibold hover:text-primary/80 transition-colors break-all text-xs sm:text-sm"
              >
                {email}
              </a>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card className="border-border">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-lg">
                <span>🕐</span>
                <span>Giờ Mở Cửa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2 p-3 sm:p-6 pt-0 sm:pt-0">
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase">Ngày Thường</p>
                <p className="text-sm sm:text-base text-foreground">{openingHours.weekday}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase">Cuối Tuần</p>
                <p className="text-sm sm:text-base text-foreground">{openingHours.weekend}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Website */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-foreground/70 text-sm sm:text-base">
            Truy cập trang web của chúng tôi:{' '}
            <a 
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {website}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
