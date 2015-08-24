require 'uri'
require 'open-uri'
require 'json'

class StaticPagesController < ApplicationController
  search_limit = 20

  $employees_list_api = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[organization_ids][]=org-fbte&engine=hr/employees_list"
  $employee_details_api = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[organization_ids][]=org-fbte&engine=hr/employee_details"
  $invoices_list_api = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[entity]=customers | suppliers&metadata[organization_ids][]=org-fbte&engine=invoices/list"

  $random_user_api = "http://api.randomuser.me/?results=%d" % search_limit

  $geocode_api = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s"
  $google_api_key = "AIzaSyAZZ6GQlDw3uHU4tXGF6kYfjQYu44fIxiU"

  $maestrano_credentials = {:ssl_verify_mode => OpenSSL::SSL::VERIFY_NONE,
                            :http_basic_authentication=>['72db99d0-05dc-0133-cefe-22000a93862b', '_cIOpimIoDi3RIviWteOTA']}

  def home
  end

  def employee
    render json: get_request($employee_details_api, $maestrano_credentials)
  end

  def employees
    new_employees_json = []
    employees_list = JSON.parse(get_request($employees_list_api, $maestrano_credentials))
    employees_list["content"]["employees"].each do |item|
      city = ""
      country = ""
      country_code = ""
      new_geocode = JSON.parse(get_request($geocode_api % [item["address"], $google_api_key]))
      new_geocode['results'][0]["address_components"].each do |addr|
        if addr['types'][0] == "locality"
          city = addr['long_name']
        elsif addr['types'][0] == "country"
          country = addr['long_name']
          country_code = addr['short_name']
        end
      end

      new_employees_json.append(
          {first_name: item["firstname"],
           lastname: item["lastname"],
           address: item["address"],
           latitude: new_geocode['results'][0]['geometry']['location']['lat'],
           longitude: new_geocode['results'][0]['geometry']['location']['lng'],
           city: city,
           country: country,
           country_code: country_code
          })
    end

    render json: new_employees_json
  end

  def invoices
    render json: get_request($invoices_list_api, $maestrano_credentials)
  end

  private
  def get_request(url, options = {})
    open(URI.escape(url), options).read
  end

  def get_random_longitude
    rand(-90.000000000...90.000000000)
  end

  def get_random_latitude
    rand(-180.000000000...180.000000000)
  end
end