import System;
import System.Windows.Forms;
import Fiddler;
import System.IO; 


class Handlers
{ 
	
	
	static function  LastModCol(oS:  Session){
		if (null != oS.oRequest) {
						var headers = oS.oResponse["Last-Modified"];
	        	return headers;
	        } else
	        	return String.Empty;
	}	




	
	static function get_x_cache_value(oSession: Session)
	{
		var arr_x_cache= new Array ();
		var s_x_cache: String="";
		
		
		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";

		if (oSession.oResponse.headers.ExistsAndContains("X-Cache","TCP"))  
				
		{  arr_x_cache=oSession.oResponse["X-Cache"].split (" ");
		   s_x_cache= arr_x_cache[0];
		}
		
		return  s_x_cache;
	}

	
	static function get_x_cache_remote_value(oSession: Session)
	{
		var arr_x_cache= new Array ();
		var s_x_cache: String="";
		
		
		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";

		if (oSession.oResponse.headers.ExistsAndContains("X-Cache-Remote","TCP"))  
				
		{  arr_x_cache=oSession.oResponse["X-Cache-Remote"].split (" ");
			s_x_cache= arr_x_cache[0];
		}
		
		return  s_x_cache;
	}


	static function get_cpcode(oSession: Session)
	{
		var arr_cpcode= new Array ();
		var s_cpcode: String="";
		
		
		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";
		
		if (oSession.oResponse["X-Cache-Key"]!="") 
		{ arr_cpcode= oSession.oResponse["X-Cache-Key"].split ('/');
			s_cpcode= arr_cpcode[3];
		}
		
		return  s_cpcode;
	}

	
	static function get_ttl(oSession: Session)
	{
		var arr_ttl= new Array ();
		var s_ttl: String="";
		
		
		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";
		
		if (oSession.oResponse["X-Cache-Key"]!="") 
		{ arr_ttl= oSession.oResponse["X-Cache-Key"].split ('/');
			s_ttl= arr_ttl[4];
		}
		
		return  s_ttl;
	}
	
	static function get_akamai_ip(oSession: Session)
	{
		var arr_x_cache= new Array ();
		var s_x_cache_ip: String="";
	
		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";
			
		if (oSession.oResponse.headers.ExistsAndContains("X-Cache","AkamaiGHost"))
		{ 	arr_x_cache= oSession.oResponse["X-Cache"].split (' ');
			arr_x_cache= arr_x_cache[2].split(".");
			arr_x_cache= arr_x_cache[0].split("-");
			arr_x_cache[0]=arr_x_cache[0].slice(1,4);
			s_x_cache_ip= arr_x_cache[0]+"."+arr_x_cache[1]+"."+arr_x_cache[2]+"."+arr_x_cache[3];
			//s_x_cache_ip="127.0.0.1";
		}	return s_x_cache_ip;
		
	}		
	

	
		
		static function get_remote_ip(oSession: Session)
		{
			var arr_x_cache= new Array ();
			var s_x_cache_ip: String="";

		if ((oSession.oResponse == null) ||
			(oSession.oResponse.headers == null)) return "";
					
			if (oSession.oResponse["X-Cache-Remote"]!="") 
			{ 	arr_x_cache= oSession.oResponse["X-Cache-Remote"].split (' ');

				arr_x_cache= arr_x_cache[2].split(".");
				arr_x_cache= arr_x_cache[0].split("-");
				arr_x_cache[0]=arr_x_cache[0].slice(1,4);
				s_x_cache_ip= arr_x_cache[0]+"."+arr_x_cache[1]+"."+arr_x_cache[2]+"."+arr_x_cache[3]; // + " " +s_x_cache_value;
			}
			return s_x_cache_ip;
		
		}		
	

	static function OnBeforeRequest(oSession: Session)
	{		
			oSession.oRequest["Pragma"] = "akamai-x-cache-on, akamai-x-cache-remote-on, akamai-x-check-cacheable, akamai-x-get-cache-key, akamai-x-get-true-cache-key, akamai-x-get-extracted-values, akamai-x-get-ssl-client-session-id, akamai-x-serial-no, akamai-x-get-request-id, akamai-x-feo-trace	";			
	}
    
    
	static function Main()
			
		{		
			var today: Date = new Date();
			FiddlerObject.StatusText = " CustomRules.js was loaded at: " + today;
			FiddlerObject.UI.lvSessions.AddBoundColumn("CPCODE", 15, get_cpcode);
			FiddlerObject.UI.lvSessions.AddBoundColumn("Cacheable", 9, "@response.X-Check-Cacheable");
			FiddlerObject.UI.lvSessions.AddBoundColumn("TTL", 5, get_ttl);
			FiddlerObject.UI.lvSessions.AddBoundColumn("Edge Status", 15, get_x_cache_value);
			FiddlerObject.UI.lvSessions.AddBoundColumn("Parent Status", 15, get_x_cache_remote_value);
			FiddlerObject.UI.lvSessions.AddBoundColumn("Server", 25, "@response.Server");
			FiddlerObject.UI.lvSessions.AddBoundColumn("Last-Modified", 15, LastModCol);
			FiddlerObject.UI.lvSessions.AddBoundColumn("CEncoding", 25, "@response.Content-Encoding");
			FiddlerObject.UI.lvSessions.AddBoundColumn("Connection", 25, "@response.Connection");
			FiddlerObject.UI.lvSessions.AddBoundColumn("MachineIP", 15, get_akamai_ip);
			FiddlerObject.UI.lvSessions.AddBoundColumn("ParentIP", 15, get_remote_ip);
			FiddlerObject.UI.lvSessions.AddBoundColumn("RequestId", 25, "@response.X-Akamai-Request-ID");		
		}		
}