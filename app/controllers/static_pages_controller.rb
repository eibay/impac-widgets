require 'uri'
require 'open-uri'

class StaticPagesController < ApplicationController
  $url_employees_list = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[organization_ids][]=org-fbte&engine=hr/employees_list"
  $url_employee_details = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[organization_ids][]=org-fbte&engine=hr/employee_details"
  $url_invoices_list = "https://api-impac-uat.maestrano.io/api/v1/get_widget?metadata[entity]=customers | suppliers&metadata[organization_ids][]=org-fbte&engine=invoices/list"

  def home
  end

  def employee
    render json: get_request($url_employee_details)
  end

  def employees
    render json: get_request($url_employees_list)
  end

  def invoices
    render json: get_request($url_invoices_list)
  end

  private
  def get_request(url)
    open(URI.escape(url), {:ssl_verify_mode => OpenSSL::SSL::VERIFY_NONE,
               :http_basic_authentication=>['72db99d0-05dc-0133-cefe-22000a93862b', '_cIOpimIoDi3RIviWteOTA']}).read
  end
end
