defmodule WebSocketHandler do
  @behaviour :cowboy_http_handler
  @behaviour :cowboy_websocket_handler
  
  def init({_any, :http}, req, _opts) do
    case :cowboy_req.header("upgrade", req) do
      {bin, req} when is_binary(bin) ->
          case :cowboy_bstr.to_lower(bin) do
            "websocket" ->
              IO.puts "Websocket starts"
              {:upgrade, :protocol, :cowboy_websocket}  
             _ ->
                not_implemented req 
          end
          {:undefined, req} ->
              not_implemented req      
      end  
  end  

  def not_implemented(req) do
    {:ok, req} = :cowboy_req.reply(501, [], [], req)
    {:shutdown, req, :undefined}
  end   

  def websocket_init(_any, req, opts) do
    IO.puts "Init called"
    send self(), get_response() 
    {:ok, file} = File.open "priv/data/ws.csv", [:write]
    IO.binwrite file, "Id,Time\n"
    {:ok, req, file}  
  end  
  
  def websocket_handle({:text, msg}, req, state) do
    t = get_timestamp()
    r = t - String.to_integer(msg)
    :io.format("Diff is ~p~n", [r]) 
    res = get_response()
    IO.binwrite state, "#{t},#{r}\n"
    {:reply, {:text, res}, req, state}
  end  

  def websocket_info(msg, req, state) do
    IO.puts "info called"
    {:reply, {:text, msg}, req, state}
  end  

  def websocket_terminate(_reason, _res, state) do
    IO.puts "Terminate"
    :ok
  end  


  def get_timestamp() do
    {mega, sec, micro} = :erlang.now()
    (mega*1000000 + sec)*1000 + round(micro/1000)
  end  

  def get_response() do
      time = get_timestamp() 
      str = :base64.encode(:crypto.strong_rand_bytes(1000))
      :jiffy.encode({[{"timestamp", time}, {"string", str}]})
  end

end
