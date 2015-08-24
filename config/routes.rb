Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/employee', to: 'static_pages#employee'
  get '/employees', to: 'static_pages#employees'
  get '/invoices', to: 'static_pages#invoices'
end
