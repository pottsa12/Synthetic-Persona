export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agent_outputs: {
        Row: {
          agent_name: string
          created_at: string
          id: string
          input_id: string | null
          output_text: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string
          id?: string
          input_id?: string | null
          output_text?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string
          id?: string
          input_id?: string | null
          output_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_outputs_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "pitch_inputs"
            referencedColumns: ["id"]
          },
        ]
      }
      "agentic-pitch-flow": {
        Row: {
          agent_name: string | null
          agent_summary: string | null
          agent_task: string | null
          client_id: number | null
          id: number
        }
        Insert: {
          agent_name?: string | null
          agent_summary?: string | null
          agent_task?: string | null
          client_id?: number | null
          id: number
        }
        Update: {
          agent_name?: string | null
          agent_summary?: string | null
          agent_task?: string | null
          client_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agentic-pitch-flow_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "agentic.pitch.clients"
            referencedColumns: ["id"]
          },
        ]
      }
      "agentic.pitch.clients": {
        Row: {
          client_name: string | null
          created_at: string
          id: number
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          client_name?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      audience_by_category_json: {
        Row: {
          audience_id: number
          behavioral_index_json: Json | null
          created_at: string | null
          credit_index_json: Json | null
          ctv_indexing_json: Json | null
          demographics_json: Json | null
          demographics_state_json: Json | null
          geo_index_json: Json | null
          id: number
          location_index_json: Json | null
          ltv_indexing_json: Json | null
          multicultural_index_json: Json | null
          persona_pulse_index_json: Json | null
          transactional_index_json: Json | null
        }
        Insert: {
          audience_id: number
          behavioral_index_json?: Json | null
          created_at?: string | null
          credit_index_json?: Json | null
          ctv_indexing_json?: Json | null
          demographics_json?: Json | null
          demographics_state_json?: Json | null
          geo_index_json?: Json | null
          id?: number
          location_index_json?: Json | null
          ltv_indexing_json?: Json | null
          multicultural_index_json?: Json | null
          persona_pulse_index_json?: Json | null
          transactional_index_json?: Json | null
        }
        Update: {
          audience_id?: number
          behavioral_index_json?: Json | null
          created_at?: string | null
          credit_index_json?: Json | null
          ctv_indexing_json?: Json | null
          demographics_json?: Json | null
          demographics_state_json?: Json | null
          geo_index_json?: Json | null
          id?: number
          location_index_json?: Json | null
          ltv_indexing_json?: Json | null
          multicultural_index_json?: Json | null
          persona_pulse_index_json?: Json | null
          transactional_index_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audience_by_category_json_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      audience_summaries: {
        Row: {
          audience_id: number
          client_name: string | null
          created_at: string | null
          creative_name: string | null
          creative_optimization_recommendation: string
          creative_url: string | null
          creative_url_optimized: string | null
          data_source: string | null
          id: number
          optimization_rationale: string
          recommendation_order: number | null
        }
        Insert: {
          audience_id: number
          client_name?: string | null
          created_at?: string | null
          creative_name?: string | null
          creative_optimization_recommendation: string
          creative_url?: string | null
          creative_url_optimized?: string | null
          data_source?: string | null
          id?: number
          optimization_rationale: string
          recommendation_order?: number | null
        }
        Update: {
          audience_id?: number
          client_name?: string | null
          created_at?: string | null
          creative_name?: string | null
          creative_optimization_recommendation?: string
          creative_url?: string | null
          creative_url_optimized?: string | null
          data_source?: string | null
          id?: number
          optimization_rationale?: string
          recommendation_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audience_summaries_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      audiences: {
        Row: {
          audience_name: string
          audience_summary: string | null
          created_at: string | null
          id: number
          upload_date: string | null
        }
        Insert: {
          audience_name: string
          audience_summary?: string | null
          created_at?: string | null
          id?: number
          upload_date?: string | null
        }
        Update: {
          audience_name?: string
          audience_summary?: string | null
          created_at?: string | null
          id?: number
          upload_date?: string | null
        }
        Relationships: []
      }
      behavioral_index: {
        Row: {
          audience_id: number | null
          category: string | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          scaled_zscore: number | null
          segment_code: string | null
          segment_name: string | null
          segment_path: string | null
          sub_category: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          segment_path?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          segment_path?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "behavioral_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      client_retail_names: {
        Row: {
          client_name: string
          id: number
        }
        Insert: {
          client_name: string
          id?: number
        }
        Update: {
          client_name?: string
          id?: number
        }
        Relationships: []
      }
      competitor_locations: {
        Row: {
          address: string | null
          client_id: number | null
          client_name: string | null
          competitive_brand: string
          id: number
          lat: number
          long: number
          name: string | null
          zip_code: string
        }
        Insert: {
          address?: string | null
          client_id?: number | null
          client_name?: string | null
          competitive_brand: string
          id?: number
          lat: number
          long: number
          name?: string | null
          zip_code: string
        }
        Update: {
          address?: string | null
          client_id?: number | null
          client_name?: string | null
          competitive_brand?: string
          id?: number
          lat?: number
          long?: number
          name?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_locations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_retail_names"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage: {
        Row: {
          audience_id: number | null
          field: string | null
          field_metric: string | null
          id: number
          input_audience_size: number | null
          match_rate: number | null
          metric_value: number | null
        }
        Insert: {
          audience_id?: number | null
          field?: string | null
          field_metric?: string | null
          id?: number
          input_audience_size?: number | null
          match_rate?: number | null
          metric_value?: number | null
        }
        Update: {
          audience_id?: number | null
          field?: string | null
          field_metric?: string | null
          id?: number
          input_audience_size?: number | null
          match_rate?: number | null
          metric_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coverage_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_index: {
        Row: {
          audience_id: number | null
          category: string | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          scaled_zscore: number | null
          segment_code: string | null
          segment_name: string | null
          sub_category: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      ctv_indexing: {
        Row: {
          attribute: string | null
          audience_id: number | null
          audience_name: string | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          scaled_zscore: number | null
          value: string | null
          zscore: number | null
        }
        Insert: {
          attribute?: string | null
          audience_id?: number | null
          audience_name?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Update: {
          attribute?: string | null
          audience_id?: number | null
          audience_name?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ctv_indexing_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      demographics: {
        Row: {
          audience_id: number | null
          category: string | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          difference: number | null
          difference_plus: number | null
          factor: string | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          id: number
          index_value: number | null
          value: string | null
        }
        Insert: {
          audience_id?: number | null
          category?: string | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          difference?: number | null
          difference_plus?: number | null
          factor?: string | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          value?: string | null
        }
        Update: {
          audience_id?: number | null
          category?: string | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          difference?: number | null
          difference_plus?: number | null
          factor?: string | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demographics_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      demographics_state: {
        Row: {
          audience_id: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          difference: number | null
          difference_plus_0_07: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          id: number
          index_value: number | null
          state: string | null
        }
        Insert: {
          audience_id?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          difference?: number | null
          difference_plus_0_07?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          state?: string | null
        }
        Update: {
          audience_id?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          difference?: number | null
          difference_plus_0_07?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demographics_state_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      dma_names: {
        Row: {
          dma_code: string
          dma_description: string
        }
        Insert: {
          dma_code: string
          dma_description: string
        }
        Update: {
          dma_code?: string
          dma_description?: string
        }
        Relationships: []
      }
      dmas_zipcodes_usa_all: {
        Row: {
          dma_code: string | null
          dma_description: string | null
          id: number
          zip_code: string | null
        }
        Insert: {
          dma_code?: string | null
          dma_description?: string | null
          id?: number
          zip_code?: string | null
        }
        Update: {
          dma_code?: string | null
          dma_description?: string | null
          id?: number
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_dma_code"
            columns: ["dma_code"]
            isOneToOne: false
            referencedRelation: "dma_names"
            referencedColumns: ["dma_code"]
          },
        ]
      }
      geo_index: {
        Row: {
          audience_id: number | null
          city: string | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          dmaname: string | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          id: number
          index_value: number | null
          lat: number | null
          lng: number | null
          scaled_zscore: number | null
          state: string | null
          zipcode: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          city?: string | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          dmaname?: string | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          lat?: number | null
          lng?: number | null
          scaled_zscore?: number | null
          state?: string | null
          zipcode?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          city?: string | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          dmaname?: string | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          lat?: number | null
          lng?: number | null
          scaled_zscore?: number | null
          state?: string | null
          zipcode?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "geo_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      json_audience_summary: {
        Row: {
          audience_id: number | null
          audience_json: Json
          created_at: string | null
          id: number
        }
        Insert: {
          audience_id?: number | null
          audience_json: Json
          created_at?: string | null
          id?: number
        }
        Update: {
          audience_id?: number | null
          audience_json?: Json
          created_at?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "json_audience_summary_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      "loc.aud.radii_Regions_BankOfAmerica": {
        Row: {
          address: string | null
          audience_count: number | null
          audience_id: number | null
          client_id: number | null
          client_name: string | null
          competitor_location_counts: string | null
          id: number
          lat: number | null
          location_id: number | null
          long: number | null
          radius: number | null
          store_name: string | null
          zip_code: number | null
        }
        Insert: {
          address?: string | null
          audience_count?: number | null
          audience_id?: number | null
          client_id?: number | null
          client_name?: string | null
          competitor_location_counts?: string | null
          id?: number
          lat?: number | null
          location_id?: number | null
          long?: number | null
          radius?: number | null
          store_name?: string | null
          zip_code?: number | null
        }
        Update: {
          address?: string | null
          audience_count?: number | null
          audience_id?: number | null
          client_id?: number | null
          client_name?: string | null
          competitor_location_counts?: string | null
          id?: number
          lat?: number | null
          location_id?: number | null
          long?: number | null
          radius?: number | null
          store_name?: string | null
          zip_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loc.aud.radii_Regions_BankOfAmerica_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "retail_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_index: {
        Row: {
          audience_id: number | null
          category: string | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          location_brand: string | null
          outlier: boolean | null
          scaled_zscore: number | null
          segment_code: string | null
          segment_name: string | null
          sub_category: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          location_brand?: string | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          location_brand?: string | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "location_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      locationintelligence_maplegend: {
        Row: {
          client_id: number | null
          client_name: string
          created_at: string
          id: number
          maplegend_clientname: string | null
          maplegend_competitors: string | null
        }
        Insert: {
          client_id?: number | null
          client_name: string
          created_at?: string
          id?: number
          maplegend_clientname?: string | null
          maplegend_competitors?: string | null
        }
        Update: {
          client_id?: number | null
          client_name?: string
          created_at?: string
          id?: number
          maplegend_clientname?: string | null
          maplegend_competitors?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location-intelligence_map-legend_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "client_retail_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location-intelligence_map-legend_client_name_fkey"
            columns: ["client_name"]
            isOneToOne: false
            referencedRelation: "client_retail_names"
            referencedColumns: ["client_name"]
          },
        ]
      }
      ltv_indexing: {
        Row: {
          attribute: string | null
          audience_id: number | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          scaled_zscore: number | null
          value: string | null
          zscore: number | null
        }
        Insert: {
          attribute?: string | null
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Update: {
          attribute?: string | null
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ltv_indexing_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      mastercard_daily_sales_by_category: {
        Row: {
          category: string
          commerce_type: string | null
          currency: string | null
          date: string | null
          geography: string
          id: number
          Id: number | null
          previous_year_sales: number | null
          sales: number | null
          yoy_change: number | null
        }
        Insert: {
          category: string
          commerce_type?: string | null
          currency?: string | null
          date?: string | null
          geography: string
          id?: number
          Id?: number | null
          previous_year_sales?: number | null
          sales?: number | null
          yoy_change?: number | null
        }
        Update: {
          category?: string
          commerce_type?: string | null
          currency?: string | null
          date?: string | null
          geography?: string
          id?: number
          Id?: number | null
          previous_year_sales?: number | null
          sales?: number | null
          yoy_change?: number | null
        }
        Relationships: []
      }
      mastercard_forecasted_monthly_sales_by_state: {
        Row: {
          Currency: string | null
          endDate: string | null
          geography: string | null
          id: number
          id_1: number | null
          PreviousYearSales: number | null
          Sales_Projected: number | null
          sector: string | null
          startDate: string | null
          yoy_change: number | null
        }
        Insert: {
          Currency?: string | null
          endDate?: string | null
          geography?: string | null
          id?: number
          id_1?: number | null
          PreviousYearSales?: number | null
          Sales_Projected?: number | null
          sector?: string | null
          startDate?: string | null
          yoy_change?: number | null
        }
        Update: {
          Currency?: string | null
          endDate?: string | null
          geography?: string | null
          id?: number
          id_1?: number | null
          PreviousYearSales?: number | null
          Sales_Projected?: number | null
          sector?: string | null
          startDate?: string | null
          yoy_change?: number | null
        }
        Relationships: []
      }
      MediaData_MTA: {
        Row: {
          Attr_Per_HH: number | null
          Attr_Per_Imp: number | null
          attribution_name: string
          attribution_type: string
          Attributions: number | null
          Avg_Frequency: number | null
          broadcast_month: string
          broadcast_year: number
          client_id: number
          client_name: string
          DMA: string | null
          end_date: string
          exposure_cohort: string | null
          exposure_type: string | null
          id: number
          Impressions: number | null
          Local_Market_Reach_Percentage: number | null
          Network: string | null
          Reach: number | null
          start_date: string
          Tot_TV_Homes: number | null
        }
        Insert: {
          Attr_Per_HH?: number | null
          Attr_Per_Imp?: number | null
          attribution_name: string
          attribution_type: string
          Attributions?: number | null
          Avg_Frequency?: number | null
          broadcast_month: string
          broadcast_year: number
          client_id: number
          client_name: string
          DMA?: string | null
          end_date: string
          exposure_cohort?: string | null
          exposure_type?: string | null
          id?: number
          Impressions?: number | null
          Local_Market_Reach_Percentage?: number | null
          Network?: string | null
          Reach?: number | null
          start_date: string
          Tot_TV_Homes?: number | null
        }
        Update: {
          Attr_Per_HH?: number | null
          Attr_Per_Imp?: number | null
          attribution_name?: string
          attribution_type?: string
          Attributions?: number | null
          Avg_Frequency?: number | null
          broadcast_month?: string
          broadcast_year?: number
          client_id?: number
          client_name?: string
          DMA?: string | null
          end_date?: string
          exposure_cohort?: string | null
          exposure_type?: string | null
          id?: number
          Impressions?: number | null
          Local_Market_Reach_Percentage?: number | null
          Network?: string | null
          Reach?: number | null
          start_date?: string
          Tot_TV_Homes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "MediaData_MTA_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_retail_names"
            referencedColumns: ["id"]
          },
        ]
      }
      multicultural_index: {
        Row: {
          audience_id: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          id: number
          index_value: number | null
          race: string | null
          scaled_zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          race?: string | null
          scaled_zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          id?: number
          index_value?: number | null
          race?: string | null
          scaled_zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "multicultural_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      ooh_locations: {
        Row: {
          id: number
          latitude: number | null
          longitude: number | null
          media_owner: string
          venue_name: string
          venue_type: string
          zip_code: string | null
        }
        Insert: {
          id?: number
          latitude?: number | null
          longitude?: number | null
          media_owner: string
          venue_name: string
          venue_type: string
          zip_code?: string | null
        }
        Update: {
          id?: number
          latitude?: number | null
          longitude?: number | null
          media_owner?: string
          venue_name?: string
          venue_type?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      persona_pulse_index: {
        Row: {
          audience_id: number | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          p_code: string | null
          parent_p_code: string | null
          parent_value: string | null
          scaled_zscore: number | null
          value: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          p_code?: string | null
          parent_p_code?: string | null
          parent_value?: string | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          p_code?: string | null
          parent_p_code?: string | null
          parent_value?: string | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "persona_pulse_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_inputs: {
        Row: {
          created_at: string
          id: string
          input_text: string | null
          uploaded_file_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          input_text?: string | null
          uploaded_file_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          input_text?: string | null
          uploaded_file_url?: string | null
        }
        Relationships: []
      }
      retail_audience_sizes: {
        Row: {
          audience_count: number
          audience_id: number | null
          client_name: string | null
          competitor_location_counts: number | null
          id: number
          last_updated: string
          radius: number
          retail_id: number
        }
        Insert: {
          audience_count?: number
          audience_id?: number | null
          client_name?: string | null
          competitor_location_counts?: number | null
          id?: number
          last_updated?: string
          radius: number
          retail_id: number
        }
        Update: {
          audience_count?: number
          audience_id?: number | null
          client_name?: string | null
          competitor_location_counts?: number | null
          id?: number
          last_updated?: string
          radius?: number
          retail_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "retail_audience_sizes_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retail_audience_sizes_retail_id_fkey"
            columns: ["retail_id"]
            isOneToOne: false
            referencedRelation: "retail_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      retail_locations: {
        Row: {
          address: string
          client_id: number | null
          client_name: string | null
          id: number
          lat: number
          long: number
          store_name: string
          zip_code: string
        }
        Insert: {
          address: string
          client_id?: number | null
          client_name?: string | null
          id?: number
          lat: number
          long: number
          store_name: string
          zip_code: string
        }
        Update: {
          address?: string
          client_id?: number | null
          client_name?: string | null
          id?: number
          lat?: number
          long?: number
          store_name?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_retail_names"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_index: {
        Row: {
          attribute: string | null
          audience_id: number | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: number | null
          scaled_zscore: number | null
          value: string | null
          zscore: number | null
        }
        Insert: {
          attribute?: string | null
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: never
          index_value?: number | null
          outlier?: number | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Update: {
          attribute?: string | null
          audience_id?: number | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: never
          index_value?: number | null
          outlier?: number | null
          scaled_zscore?: number | null
          value?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      transactional_index: {
        Row: {
          audience_id: number | null
          category: string | null
          cpi: number | null
          customer_count: number | null
          customer_ratio: number | null
          customer_total: number | null
          gcpi: number | null
          general_count: number | null
          general_ratio: number | null
          general_total: number | null
          gpi: number | null
          id: number
          index_value: number | null
          outlier: boolean | null
          scaled_zscore: number | null
          segment_code: string | null
          segment_name: string | null
          sub_category: string | null
          zscore: number | null
        }
        Insert: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Update: {
          audience_id?: number | null
          category?: string | null
          cpi?: number | null
          customer_count?: number | null
          customer_ratio?: number | null
          customer_total?: number | null
          gcpi?: number | null
          general_count?: number | null
          general_ratio?: number | null
          general_total?: number | null
          gpi?: number | null
          id?: number
          index_value?: number | null
          outlier?: boolean | null
          scaled_zscore?: number | null
          segment_code?: string | null
          segment_name?: string | null
          sub_category?: string | null
          zscore?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactional_index_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      zip_code: {
        Row: {
          id: number
          zip_code: string
        }
        Insert: {
          id?: number
          zip_code: string
        }
        Update: {
          id?: number
          zip_code?: string
        }
        Relationships: []
      }
      zip_radii: {
        Row: {
          id: number
          nearby_zip: string | null
          radius: number | null
          zip_code: string | null
        }
        Insert: {
          id?: number
          nearby_zip?: string | null
          radius?: number | null
          zip_code?: string | null
        }
        Update: {
          id?: number
          nearby_zip?: string | null
          radius?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      unique_venue_types: {
        Row: {
          venue_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
