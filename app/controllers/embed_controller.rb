class EmbedController < ApplicationController
  layout 'embed'

  def map
    if params[:print] == 'map'
      @map_url = request.original_url.sub('print=map', '')
      render :map_print 
    end
  end

  # GET /embed/country/:id
  def countries_show
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    @country = country
  end

end
