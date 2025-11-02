-- Insert master event template
INSERT INTO landing_pages (name, is_template, blocks)
VALUES (
  'Master Event Template',
  true,
  jsonb_build_object(
    'hero', jsonb_build_object(
      'title', 'High-Ticket Referral Partner Network',
      'subtitle', 'Join the most exclusive networking event for strategic partners',
      'eventDate', '2025-11-06T10:15:00',
      'location', 'The Ritz-Carlton, Downtown'
    ),
    'speakers', jsonb_build_array(
      jsonb_build_object(
        'name', 'Justice Anderson',
        'title', 'CEO',
        'company', 'TechVentures Inc',
        'bio', 'Justice Anderson is a visionary entrepreneur with over 15 years of experience in building and scaling technology companies. As the founder and CEO of TechVentures Inc, he has successfully led multiple companies through acquisition and IPO processes.',
        'photo', '/src/assets/justice-anderson.png'
      )
    ),
    'venue', jsonb_build_object(
      'name', 'The Ritz-Carlton',
      'address', 'Downtown Business District',
      'images', jsonb_build_array(
        '/src/assets/venue-conference.jpg',
        '/src/assets/venue-networking.jpg'
      ),
      'amenities', jsonb_build_array(
        'Premium Conference Facilities',
        'Dedicated Networking Lounges',
        'Gourmet Catering',
        'Private Meeting Rooms',
        'Complimentary Valet Parking',
        'High-Speed WiFi Throughout'
      )
    ),
    'schedule', jsonb_build_array(
      jsonb_build_object('time', '10:15 AM', 'activity', 'Registration & Welcome Coffee'),
      jsonb_build_object('time', '11:00 AM', 'activity', 'Opening Keynote'),
      jsonb_build_object('time', '12:00 PM', 'activity', 'Networking Session'),
      jsonb_build_object('time', '1:00 PM', 'activity', 'Lunch & Roundtables'),
      jsonb_build_object('time', '2:30 PM', 'activity', 'Partner Presentations'),
      jsonb_build_object('time', '4:00 PM', 'activity', 'Closing Remarks')
    ),
    'benefits', jsonb_build_array(
      jsonb_build_object(
        'icon', 'users',
        'title', 'Exclusive Access',
        'description', 'Connect with verified, high-value partners in your industry'
      ),
      jsonb_build_object(
        'icon', 'target',
        'title', 'Pre-Qualified Opportunities',
        'description', 'Every attendee is vetted to ensure mutual benefit and alignment'
      ),
      jsonb_build_object(
        'icon', 'trophy',
        'title', 'High ROI Potential',
        'description', 'Focus on partnerships that drive real revenue growth'
      )
    ),
    'faqs', jsonb_build_array(
      jsonb_build_object(
        'question', 'Who should attend this event?',
        'answer', 'This event is designed for business owners, executives, and professionals who are looking to establish high-value strategic partnerships. All attendees are pre-qualified to ensure alignment and mutual benefit.'
      ),
      jsonb_build_object(
        'question', 'What is the dress code?',
        'answer', 'Business professional attire is recommended. This is a high-level networking event with industry leaders.'
      ),
      jsonb_build_object(
        'question', 'Is there a cost to attend?',
        'answer', 'Attendance is by invitation only through our verified partner network. Your trusted referral partner can provide you with access details.'
      ),
      jsonb_build_object(
        'question', 'What should I bring?',
        'answer', 'Bring plenty of business cards and an open mind. We recommend coming prepared with your current business challenges and partnership goals.'
      )
    )
  )
)
ON CONFLICT DO NOTHING;