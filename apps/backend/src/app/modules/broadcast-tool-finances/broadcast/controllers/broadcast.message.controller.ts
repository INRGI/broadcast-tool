import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApproveBroadcastRequestDto,
  ApproveBroadcastSheetResponseDto,
  GetAllDomainsResponseDto,
  GetBroadcastDomainsListResponseDto,
  GetBroadcastsListResponseDto,
  GetBroadcastsSendsByIdRequestDto,
  GetBroadcastsSendsRequestDto,
  GetBroadcastsSendsResponseDto,
  MakeBroadcastRequestDto,
} from "@epc-services/interface-adapters";
import { GetBroadcastsListService } from "../services/get-broadcasts-list/get-broadcasts-list.service";
import { MakeBroadcastService } from "../services/make-broadcast/make-broadcast.service";
import { ApproveBroadcastService } from "../services/approve-broadcast/approve-broadcast.service";
import { GetBroadcastDomainsListService } from "../services/get-broadcast-domains-list/get-broadcast-domains-list.service";
import { GetBroadcastsSendsService } from "../services/get-broadcasts-sends/get-broadcasts-sends.service";
import { GetBroadcastsSendsByIdService } from "../services/get-broadcast-sends-by-id/get-broadcast-sends-by-id.service";
import { RedoBroadcastService } from "../services/redo-broadcast/redo-broadcast.service";

@Controller("finances/broadcast-tool/broadcast")
export class BroadcastController {
  constructor(
    private readonly getBroadcastsListService: GetBroadcastsListService,
    private readonly makeBroadcastService: MakeBroadcastService,
    private readonly approveBroadcastService: ApproveBroadcastService,
    private readonly getBroadcastDomainsListService: GetBroadcastDomainsListService,
    private readonly getBroadcastsSendsService: GetBroadcastsSendsService,
    private readonly getBroadcastsSendsByIdService: GetBroadcastsSendsByIdService,
    private readonly redoBroadcastService: RedoBroadcastService
  ) {}

  @Get("domains/:spreadsheetId")
  public async getBroadcastDomainsList(
    @Param("spreadsheetId") spreadsheetId: string
  ): Promise<GetBroadcastDomainsListResponseDto> {
    return await this.getBroadcastDomainsListService.execute({
      spreadsheetId,
    });
  }

  @Get("broadcasts-list")
  public async getBroadcastsList(): Promise<GetBroadcastsListResponseDto> {
    return await this.getBroadcastsListService.execute();
  }

  @Post("make-broadcast")
  public async makeBroadcast(
    @Body() body: MakeBroadcastRequestDto
  ): Promise<GetAllDomainsResponseDto> {
    return await this.makeBroadcastService.execute(body);
  }

  @Post("approve-broadcast")
  public async approveBroadcast(
    @Body() body: ApproveBroadcastRequestDto
  ): Promise<ApproveBroadcastSheetResponseDto[]> {
    return await this.approveBroadcastService.execute(body);
  }

  @Post("broadcasts-sends")
  public async getBroadcastsSends(
    @Body() body: GetBroadcastsSendsRequestDto
  ): Promise<GetBroadcastsSendsResponseDto> {
    return await this.getBroadcastsSendsService.execute(body);
  }

  @Post("broadcast-sends-by-id")
  public async getBroadcastSendsById(
    @Body() body: GetBroadcastsSendsByIdRequestDto
  ): Promise<GetBroadcastsSendsResponseDto> {
    return await this.getBroadcastsSendsByIdService.execute(body);
  }

  @Post("redo-broadcast")
  public async redoBroadcast(
    @Body() body: MakeBroadcastRequestDto
  ): Promise<GetAllDomainsResponseDto> {
    return await this.redoBroadcastService.execute(body);
  }
}
