import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalVotacaoService } from '../../service/local-votacao.service';

@Component({
  selector: 'app-busca-local-votacao',
  templateUrl: './busca-local-votacao.component.html',
  styleUrls: ['./busca-local-votacao.component.css'],
})
export class BuscaLocalVotacaoComponent implements OnInit {
  cep: string = '';
  endereco: string = '';
  numero: string = '';
  errorMessage: string = '';
  results: any[] = [];
  isLoading: boolean = false;
  
  // Estatísticas de geocodificação
  estatisticasZona: any[] = [];
  estatisticasMunicipio: any[] = [];
  showEstatisticas: boolean = false;
  isAdmin: boolean = false; // Controla a visibilidade dos recursos de admin

  private map!: google.maps.Map;
  private centralMarker!: google.maps.Marker;
  private resultMarkers: google.maps.Marker[] = [];
  private centralPosition!: google.maps.LatLng;

  constructor(
    private http: HttpClient,
    private localVotacaoService: LocalVotacaoService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    
    // Verificar se é um usuário administrativo (simplificado para exemplo)
    // Em produção, use um serviço de autenticação adequado
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Se for admin, carrega as estatísticas
    if (this.isAdmin) {
      this.carregarEstatisticas();
    }
  }

  initializeMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -12.9355, lng: -38.3371 },
      zoom: 14,
    };
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );
    this.centralMarker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });
  }

  onCepChange(): void {
    if (this.localVotacaoService.validateCep(this.cep)) {
      this.http.get(`https://viacep.com.br/ws/${this.cep}/json/`).subscribe({
        next: (response: any) => {
          if (!response.erro) {
            this.endereco = `${response.logradouro}, ${response.bairro}, ${response.localidade} - ${response.uf}`;
            const formattedAddress = this.formatarEndereco(this.endereco);

            this.localVotacaoService.getZonaByBairro(response.bairro).subscribe({
              next: (zona) => {
                sessionStorage.setItem('zonaBairro', zona.toString());
              },
              error: () => {
                sessionStorage.removeItem('zonaBairro');
              }
            });

            this.updateCentralMarkerFromAddress(formattedAddress);
          } else {
            this.errorMessage = 'CEP não encontrado.';
            this.endereco = '';
          }
        },
        error: () => {
          this.errorMessage = 'Erro ao buscar o endereço.';
          this.endereco = '';
        },
      });
    } else {
      this.errorMessage = 'CEP inválido.';
      this.endereco = '';
    }
  }

  onSearch(): void {
    this.errorMessage = '';
    this.isLoading = true;
    
    if (!this.cep || !this.numero) {
      this.errorMessage = 'Por favor, preencha o CEP e o número corretamente.';
      this.isLoading = false;
      return;
    }

    if (!this.centralPosition) {
      this.errorMessage = 'Erro ao obter coordenadas do endereço.';
      this.isLoading = false;
      return;
    }

    const lat = this.centralPosition.lat();
    const lon = this.centralPosition.lng();
    const zona = sessionStorage.getItem('zonaBairro');

    this.localVotacaoService.getVotingLocationsFiltered(lat, lon, zona ? parseInt(zona, 10) : null, 50).subscribe({
      next: (locations: any[]) => {
        this.isLoading = false;
        
        if (!locations || locations.length === 0) {
          this.errorMessage = 'Nenhum local de votação encontrado.';
          this.results = [];
          return;
        }

        const locaisComVagas = locations.filter(loc => loc.vagasDisponiveis > 0);

        if (locaisComVagas.length < 5) {
          this.errorMessage = 'Não há pelo menos 5 locais próximos com vagas disponíveis.';
        }

        this.results = locaisComVagas.slice(0, 5).map(loc => ({
          nome: loc.nome,
          endereco: loc.endereco,
          vagas: loc.vagasDisponiveis,
          distancia: loc.distancia,
          codigoLocal: loc.codigoLocal,
          numeroZona: loc.numeroZona,
          latitude: loc.latitude,
          longitude: loc.longitude,
          mapaLink: this.gerarLinkMapa(loc)
        }));

        this.updateMapMarkers();
      },
      error: (err) => {
        console.error('Erro ao buscar locais:', err);
        this.errorMessage = 'Erro ao buscar os locais de votação.';
        this.isLoading = false;
      }
    });
  }
  
  gerarLinkMapa(local: any): string {
    // Prefere usar coordenadas quando disponíveis, caso contrário usa o endereço
    if (local.latitude && local.longitude) {
      return `https://www.google.com/maps?q=${local.latitude},${local.longitude}`;
    } else {
      return `https://www.google.com/maps?q=${encodeURIComponent(local.endereco)}`;
    }
  }

  // Funções administrativas
  carregarEstatisticas(): void {
    this.localVotacaoService.getEstatisticasPorZona().subscribe({
      next: (data) => {
        this.estatisticasZona = data;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas por zona:', err);
      }
    });
    
    this.localVotacaoService.getEstatisticasPorMunicipio().subscribe({
      next: (data) => {
        this.estatisticasMunicipio = data;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas por município:', err);
      }
    });
  }

  iniciarGeocodificacaoEmMassa(): void {
    if (confirm('Iniciar a geocodificação em massa de todos os locais sem coordenadas? Este processo pode demorar.')) {
      this.isLoading = true;
      this.localVotacaoService.iniciarGeocodificacaoEmMassa().subscribe({
        next: (resultado) => {
          this.isLoading = false;
          alert(`Processamento concluído! ${resultado.totalGeocodificado} locais geocodificados.`);
          this.carregarEstatisticas(); // Atualiza as estatísticas
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erro na geocodificação em massa:', err);
          alert('Ocorreu um erro durante o processamento.');
        }
      });
    }
  }

  toggleEstatisticas(): void {
    this.showEstatisticas = !this.showEstatisticas;
    if (this.showEstatisticas && this.isAdmin) {
      this.carregarEstatisticas();
    }
  }

  private formatarEndereco(endereco: string): string {
    let enderecoLimpo = endereco.replace(/,?\s*CEP:\s*\d{5}-?\d{3}/gi, '').trim();
    enderecoLimpo = enderecoLimpo.replace(/\bR\./gi, 'Rua');
    enderecoLimpo = enderecoLimpo.replace(/\bAv\./gi, 'Avenida');
    enderecoLimpo = enderecoLimpo.replace(/\bAl\./gi, 'Alameda');

    if (!enderecoLimpo.toLowerCase().includes('brasil')) {
      enderecoLimpo += ', Brasil';
    }

    if (this.numero) {
      // Adiciona o número ao endereço se não estiver presente
      const temNumero = new RegExp(`\\b${this.numero}\\b`, 'i').test(enderecoLimpo);
      if (!temNumero) {
        const partes = enderecoLimpo.split(',');
        // Adiciona o número à primeira parte (logradouro)
        partes[0] = `${partes[0]}, ${this.numero}`;
        enderecoLimpo = partes.join(',');
      }
    }

    return enderecoLimpo;
  }

  private updateCentralMarkerFromAddress(address: string): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        this.map.setCenter(location);
        this.map.setZoom(15);
        this.centralMarker.setPosition(location);
        this.centralPosition = location;
      } else {
        console.error('Erro ao geocodificar endereço:', status);
        this.errorMessage = 'Não foi possível localizar o endereço no mapa.';
      }
    });
  }

  private updateMapMarkers(): void {
    // Limpar marcadores existentes
    this.resultMarkers.forEach(marker => marker.setMap(null));
    this.resultMarkers = [];

    // Obter bounds para ajustar o mapa
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(this.centralPosition);

    // Criar marcadores para cada resultado
    this.results.forEach((local, index) => {
      if (local.latitude && local.longitude) {
        const position = new google.maps.LatLng(local.latitude, local.longitude);
        
        // Criar um marcador com número
        const marker = new google.maps.Marker({
          position,
          map: this.map,
          title: local.nome,
          label: {
            text: (index + 1).toString(),
            color: 'white'
          }
        });

        // Adicionar um infowindow com detalhes
        const infoContent = `
          <div style="width: 200px">
            <h5 style="margin: 5px 0">${local.nome}</h5>
            <p style="margin: 5px 0; font-size: 12px">${local.endereco}</p>
            <p style="margin: 5px 0">Vagas: ${local.vagas}</p>
            <p style="margin: 5px 0">Distância: ${local.distancia.toFixed(2)} km</p>
            <a href="${local.mapaLink}" target="_blank" style="color: blue; text-decoration: underline">Ver no Google Maps</a>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });
        
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });

        this.resultMarkers.push(marker);
        bounds.extend(position);
      }
    });

    // Ajustar o mapa para mostrar todos os marcadores
    if (this.resultMarkers.length > 0) {
      this.map.fitBounds(bounds);
      
      // Evitar zoom excessivo para poucos marcadores
      const maxZoom = 16;
      if (this.map.getZoom()! > maxZoom) {
        this.map.setZoom(maxZoom);
      }
    }
  }
}
