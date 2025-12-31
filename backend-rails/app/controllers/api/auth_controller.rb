module Api
  class AuthController < ApplicationController
    VALID_CREDENTIALS = {
      username: 'admin',
      password: 'admin'
    }.freeze

    def login
      username = params[:username]
      password = params[:password]

      if username.blank? || password.blank?
        return render json: { error: 'Username and password are required' }, status: :bad_request
      end

      if username == VALID_CREDENTIALS[:username] && password == VALID_CREDENTIALS[:password]
        render json: {
          success: true,
          message: 'Login successful',
          user: { username: username }
        }, status: :ok
      else
        render json: { error: 'Invalid username or password' }, status: :unauthorized
      end
    rescue => e
      Rails.logger.error("Login error: #{e.message}")
      render json: { error: 'Internal server error' }, status: :internal_server_error
    end
  end
end
