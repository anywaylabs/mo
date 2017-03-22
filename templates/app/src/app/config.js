module.exports = {
  contact_email: 'mail@domain.com',
  env: process.env.NODE_ENV || 'development',
  debug: process.env.NODE_ENV != 'production',
  regular_page_transition: 'fastfade',
  reload_data_on_page_show: true,
  secure_vclick: true,
  server_url_api: 'http://localhost:3000',
  slide_page_transition: 'slidefade'
};