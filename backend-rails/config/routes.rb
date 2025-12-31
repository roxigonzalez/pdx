Rails.application.routes.draw do
  namespace :api do
    post 'login', to: 'auth#login'
    resources :pokemons, only: [:index, :show]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
